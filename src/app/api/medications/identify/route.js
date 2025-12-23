export async function POST(request) {
  try {
    const { name } = await request.json();
    console.log("name", name)
    // 1. Get RxCUI
    const rxcuiRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(name)}`);
    const rxcuiData = await rxcuiRes.json();
    console.log("rxcuiData",rxcuiData)
    const id = rxcuiData.idGroup?.rxnormId?.[0];

    if (!id) return Response.json({ error: "Not found" });

    // 2. Get Attributes
    const propRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${id}/allProperties.json?prop=attributes`);
    const propData = await propRes.json();
    const props = propData.propConceptGroup?.propConcept || [];

    const imprint = props.find(p => p.propName === 'IMPRINT')?.propValue || "N/A";
    const color = props.find(p => p.propName === 'COLOR')?.propValue || "N/A";
    const shape = props.find(p => p.propName === 'SHAPE')?.propValue || "N/A";

    // 3. Manual Formatting instead of AI
    const visualDescription = `A ${color.toLowerCase()} ${shape.toLowerCase()} pill with '${imprint}' imprint.`;

    return Response.json({
      id,
      name,
      imprint,
      color,
      shape,
      visualDescription
    });
  } catch (error) {
    return Response.json({ error: "Failed" });
  }
}