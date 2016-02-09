//noinspection JSCommentMatchesSignature
/**
 * Takes a set of content area description objects and returns a new
 * set of content area description objects with updated `skip` attributes.
 * The `skip` attributes tell us which fragments should be skipped when
 * rendering the content area and they depend on which headings are
 * currently collpased.
 *
 * @param Array contentAreas; The contentAreas array [{ id: String, skip: [[Number, Number]], size: Number }]
 * @param Object fragments; All the document's fragments { fragId: { type: String } }
 * @param Array fragmentIds; All the fragments ids in order of appearance. [fragId]
 * @param Object collapsed; An object that tells us which heading fragments are collapsed. { fragId: Boolean }
**/
export function calcSkipped(contentAreas, fragments, fragmentIds, collapsed){
  let areas = contentAreas.map(clone);
  let maxLevel = 1000;
  let collapsedLevel = maxLevel;

  let area, id, index = -1;
  let nextAreaStartsAt = 0;
  let areaIndex = 0;
  let skipSeg = null;

  while(id = fragmentIds[++index]){
    // Find the area where this fragment occurs
    if(nextAreaStartsAt === index){
      // If there is an open skip segment, terminate it before
      // switching to a new area.
      if(skipSeg){
        skipSeg.length = index - skipSeg.start;
      }

      area = areas[areaIndex];
      area.skip = [];
      areaIndex += 1;
      nextAreaStartsAt += area.size;

      // Now re-open it
      if(skipSeg){
        area.skip.push(skipSeg = { start: index });
      }
    }

    if(id in fragments){
      let frag = fragments[id];

      // Only headings are collapsible
      if(frag.type !== frag_type.heading){
        continue;
      }

      // The previous collapsed heading is of lesser or equal level
      // therefore we need to render this heading.
      if(frag.level <= collapsedLevel){
        // Terminate the existing skip segment
        if(skipSeg){
          skipSeg.length = index - skipSeg.start;
          // Cleanup empty skip segments (very rare occasions when an area starts with a heading).
          if(skipSeg.length <= 0){
            area.skip.pop();
          }
          skipSeg = null;
        }
        // This is also a collapsed heading, create a new skip segment
        // and adjust the collapsed level
        if(id in collapsed){
          area.skip.push(skipSeg = { start: index + 1 });
          collapsedLevel = frag.level;
        }
        // Otherwise set the collapsed level to default
        else {
          collapsedLevel = maxLevel;
        }
      }
    }
  }

  return areas;
}
