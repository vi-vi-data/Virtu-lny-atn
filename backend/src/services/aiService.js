import fetch from 'node-fetch';

function scoreItem(item, context) {
  let score = 0;

  if (context.season && item.season && item.season.toLowerCase() === context.season.toLowerCase()) {
    score += 3;
  }

  if (context.style && item.style && item.style.toLowerCase() === context.style.toLowerCase()) {
    score += 3;
  }

  if (context.occasion) {
    const occasion = context.occasion.toLowerCase();
    const formality = (item.formality || '').toLowerCase();

    if (occasion.includes('work') || occasion.includes('office')) {
      if (formality === 'formal') score += 3;
      if (formality === 'smart-casual') score += 2;
    } else if (occasion.includes('party') || occasion.includes('event')) {
      if (formality === 'formal' || formality === 'smart-casual') score += 2;
    } else {
      if (formality === 'casual') score += 2;
    }
  }

  if (context.weatherType) {
    const weather = context.weatherType.toLowerCase();
    const category = item.category.toLowerCase();

    if (weather.includes('rain') && ['jacket', 'coat', 'hoodie', 'shoes'].includes(category)) score += 2;
    if (weather.includes('cold') && ['jacket', 'coat', 'sweater', 'hoodie', 'boots'].includes(category)) score += 2;
    if (weather.includes('hot') && ['t-shirt', 'shirt', 'dress', 'shorts', 'skirt'].includes(category)) score += 2;
  }

  return score;
}

function pickBest(items, categoryAliases, context) {
  const filtered = items.filter((item) => categoryAliases.includes(item.category.toLowerCase()));
  if (!filtered.length) return null;

  return filtered
    .map((item) => ({ ...item, _score: scoreItem(item, context) }))
    .sort((a, b) => b._score - a._score || b.id - a.id)[0];
}

function buildRuleBasedRecommendation(items, context) {
  const top = pickBest(items, ['t-shirt', 'shirt', 'blouse', 'sweater', 'top', 'hoodie'], context);
  const bottom = pickBest(items, ['jeans', 'trousers', 'pants', 'skirt', 'shorts'], context);
  const shoes = pickBest(items, ['shoes', 'sneakers', 'boots', 'heels'], context);
  const outerwear = pickBest(items, ['jacket', 'coat', 'blazer'], context);
  const accessory = pickBest(items, ['accessory', 'bag', 'hat', 'scarf'], context);

  const selectedItems = [top, bottom, shoes, outerwear, accessory].filter(Boolean);

  return {
    name: `AI outfit for ${context.occasion || 'today'}`,
    explanation: `Odporúčanie bolo vytvorené na základe štýlu "${context.style || 'any'}", sezóny "${context.season || 'any'}" a počasia "${context.weatherType || 'unknown'}".`,
    items: selectedItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      season: item.season,
      style: item.style,
      formality: item.formality,
      image_url: item.image_url
    }))
  };
}

function buildGeminiPrompt(items, context) {
  return `
You are a fashion stylist assistant.

Task:
Recommend one practical outfit from the user's wardrobe.

Context:
- Occasion: ${context.occasion || 'not specified'}
- Weather: ${context.weatherType || 'not specified'}
- Style: ${context.style || 'not specified'}
- Season: ${context.season || 'not specified'}

Wardrobe items:
${JSON.stringify(items, null, 2)}

Return ONLY valid JSON in this format:
{
  "name": "Outfit name",
  "explanation": "Short explanation in Slovak",
  "items": [
    {
      "id": 1,
      "name": "Item name",
      "category": "Item category"
    }
  ]
}
`;
}

function extractJson(text) {
  const codeBlock = text.match(/```json\s*([\s\S]*?)```/i);
  if (codeBlock) {
    return JSON.parse(codeBlock[1]);
  }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    return JSON.parse(text.slice(firstBrace, lastBrace + 1));
  }

  throw new Error('AI response does not contain valid JSON');
}

export async function recommendOutfitWithAI(items, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!items.length) {
    return {
      name: 'Žiadny outfit',
      explanation: 'Používateľ zatiaľ nemá uložené oblečenie.',
      items: []
    };
  }

  if (!apiKey) {
    return buildRuleBasedRecommendation(items, context);
  }

  const prompt = buildGeminiPrompt(items, context);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    return buildRuleBasedRecommendation(items, context);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';

  try {
    return extractJson(text);
  } catch (error) {
    return buildRuleBasedRecommendation(items, context);
  }
}
