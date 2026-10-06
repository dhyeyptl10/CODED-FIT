/**
 * CODED FIT — AI & Voice Orchestration Provider (GPT Astra / JARVIS)
 * Translates natural language voice/text commands (English, Hindi, Hinglish)
 * into structured customization commands:
 * {
 *   action: 'UPDATE_CUSTOMIZATION',
 *   reply: string,
 *   changes: { garmentType, color, buttons, fit, fabric, collar }
 * }
 */

class AIProvider {
  async processCommand(text, context = {}) {
    throw new Error('processCommand must be implemented');
  }
}

class AstraVoiceProvider extends AIProvider {
  parseCustomizationRules(text) {
    const lower = text.toLowerCase();
    const changes = {};
    let isCustomization = false;

    // Color extraction
    const colorMap = {
      black: '#0b0c0f',
      kala: '#0b0c0f',
      kali: '#0b0c0f',
      white: '#ffffff',
      safed: '#ffffff',
      charcoal: '#282b30',
      navy: '#1e3a8a',
      blue: '#1e3a8a',
      neela: '#1e3a8a',
      red: '#7f1d1d',
      lal: '#7f1d1d',
      gold: '#c9a84c',
      sunhera: '#c9a84c',
      olive: '#0f766e',
      sand: '#e4e2dd',
      cream: '#faf8f5'
    };

    for (const [name, hex] of Object.entries(colorMap)) {
      if (lower.includes(name)) {
        changes.color = hex;
        isCustomization = true;
        break;
      }
    }

    // Garment Type
    if (lower.includes('shirt') && !lower.includes('t-shirt') && !lower.includes('tshirt')) {
      changes.garmentType = 'shirt';
      isCustomization = true;
    } else if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('tee')) {
      changes.garmentType = 'tshirt';
      isCustomization = true;
    } else if (lower.includes('hoodie') || lower.includes('sweatshirt')) {
      changes.garmentType = 'hoodie';
      isCustomization = true;
    } else if (lower.includes('pant') || lower.includes('trouser') || lower.includes('cargo')) {
      changes.garmentType = 'pants';
      isCustomization = true;
    }

    // Fit
    if (lower.includes('oversized') || lower.includes('loose') || lower.includes('baggy')) {
      changes.fit = 'oversized';
      isCustomization = true;
    } else if (lower.includes('slim') || lower.includes('tight') || lower.includes('fitted')) {
      changes.fit = 'slim';
      isCustomization = true;
    } else if (lower.includes('regular') || lower.includes('classic')) {
      changes.fit = 'regular';
      isCustomization = true;
    }

    // Buttons
    if (lower.includes('black button') || lower.includes('dark button')) {
      changes.buttons = 'matte-obsidian';
      isCustomization = true;
    } else if (lower.includes('white button') || lower.includes('pearl button')) {
      changes.buttons = 'mother-of-pearl';
      isCustomization = true;
    } else if (lower.includes('horn button')) {
      changes.buttons = 'horn';
      isCustomization = true;
    }

    // Collar
    if (lower.includes('cuban') || lower.includes('resort')) {
      changes.collar = 'cuban';
      isCustomization = true;
    } else if (lower.includes('mandarin') || lower.includes('band') || lower.includes('chinese collar')) {
      changes.collar = 'band';
      isCustomization = true;
    } else if (lower.includes('spread') || lower.includes('cutaway')) {
      changes.collar = 'spread';
      isCustomization = true;
    }

    // Fabric
    if (lower.includes('linen') || lower.includes('summer')) {
      changes.fabric = 'Ahmedabad Organic Linen';
      isCustomization = true;
    } else if (lower.includes('cotton') || lower.includes('gots')) {
      changes.fabric = '100% GOTS Organic Cotton';
      isCustomization = true;
    }

    if (isCustomization) {
      return {
        action: 'UPDATE_CUSTOMIZATION',
        reply: `Customizing now: ${Object.entries(changes).map(([k, v]) => `${k} → ${v}`).join(', ')}. Scene calibrated.`,
        spokenReply: `Done! Adjusted ${Object.keys(changes).join(' and ')} on your garment.`,
        changes
      };
    }

    return null;
  }

  async processCommand(text, context = {}) {
    // 1. First run fast deterministic parser
    const ruleMatch = this.parseCustomizationRules(text);
    if (ruleMatch) return ruleMatch;

    // 2. Query recommendations / questions
    const lower = text.toLowerCase();
    if (lower.includes('summer') || lower.includes('garmi')) {
      return {
        action: 'SUGGEST_PRODUCTS',
        reply: 'For summer heat, we recommend our Ahmedabad GOTS Organic Linen overshirts and breathable 220 GSM combed cotton tees.',
        spokenReply: 'For summer, our breathable Ahmedabad Organic Linen overshirts are the top pick.',
        productSuggestions: [
          { id: 'cf-prod-01', name: 'Alabaster Crisp Linen Shirt', price: 3499, image: 'images/hero-men.png' },
          { id: 'cf-prod-02', name: 'Oversized Sand Combed Tee', price: 1899, image: 'images/hero-women.png' }
        ],
        suggestedPrompts: ['Make it oversized', 'Show in navy blue', 'Check my size']
      };
    }

    // 3. Fallback friendly response
    return {
      action: 'CHAT_REPLY',
      reply: `I heard: "${text}". I can customize garment colors, collars, buttons, fabrics, or recommend fits based on your 3D profile.`,
      spokenReply: `I can help you customize colors, collars, or check sizing. What would you like to design?`,
      suggestedPrompts: ['Black shirt bana do', 'Isko oversized kar do', 'White shirt with black buttons', 'Summer suggestions']
    };
  }
}

function getAIProvider() {
  return new AstraVoiceProvider();
}

module.exports = {
  AIProvider,
  AstraVoiceProvider,
  getAIProvider
};
