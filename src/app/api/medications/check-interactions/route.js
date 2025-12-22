import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { names } = await request.json(); 

    // 1. Resolve names to RxCUIs using: /REST/rxcui?name=yourName
    const rxcuis = await Promise.all(names.map(async (name) => {
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      console.log("id", data)
      return data.idGroup?.rxnormId?.[0]; 
    }));

    const validIds = rxcuis.filter(id => id);
    if (validIds.length < 2) return NextResponse.json({ interactions: [] });

    // 2. Resolve to Ingredient IDs using: /REST/rxcui/{rxcui}/related?tty=IN
    const ingredientIds = await Promise.all(validIds.map(async (id) => {
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${id}/related.json?tty=IN`);
      const data = await res.json();
      console.log(data.relatedGroup?.conceptGroup?.[0]?.conceptProperties?.[0])
      // DRILL DOWN LOGIC:
      // conceptGroup is an array. We need the first element's conceptProperties
      const conceptProps = data.relatedGroup?.conceptGroup?.[0]?.conceptProperties?.[0];

      if (conceptProps) {
        console.log("Found Ingredient:", conceptProps.name, "ID:", conceptProps.rxcui);
        return conceptProps.rxcui;
      }
      
      return id; // Fallback to original ID if no ingredient-specific ID exists
    }));

    console.log("Final Ingredient IDs for check:", ingredientIds);
// /
    // 3. Final Safety Check
    const interactionUrl = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${ingredientIds.join('+')}`;
    console.log("interactionUrl", interactionUrl)
    const interRes = await fetch(interactionUrl);
    console.log("interRes", interRes)
    // NIH returns 404 if no interactions are found in their database
    if (interRes.status === 404) return NextResponse.json({ interactions: [] });

    const interData = await interRes.json();
    
    // Parse the complex nested structure of the interaction response
    const interactions = interData.fullInteractionTypeGroup?.flatMap(group => 
      group.fullInteractionType.map(type => ({
        description: type.interactionPair[0].description,
        severity: type.interactionPair[0].severity
      }))
    ) || [];

    return NextResponse.json({ interactions });

  } catch (error) {
    console.error("DETAILED ERROR:", error); // This will now show you why it was failing
    return NextResponse.json({ interactions: [], error: error.message });
  }
}