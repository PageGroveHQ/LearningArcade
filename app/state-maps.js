// U.S. map rendering for placement questions and state outlines.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  async function renderStatePlacement(q){
    const stage=$("#placementMap");
    try{
      if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}
      const features=topojson.feature(mapTopology,mapTopology.objects.states).features;
      const collection={type:"FeatureCollection",features};
      const projection=d3.geoAlbersUsa().fitExtent([[8,8],[572,348]],collection);
      const path=d3.geoPath(projection);
      stage.innerHTML=`<div class="placement-map-viewport"><svg viewBox="0 0 580 356" role="img" aria-label="Interactive United States placement map"><g data-placement-map-layer>${features.map(feature=>`<path data-state-id="${String(feature.id).padStart(2,'0')}" d="${path(feature)||''}"><title>Choose this location</title></path>`).join('')}</g></svg><div class="map-zoom-controls" aria-label="Map zoom controls"><button type="button" data-map-zoom="in" aria-label="Zoom in">+</button><button type="button" data-map-zoom="out" aria-label="Zoom out">−</button><button type="button" data-map-zoom="reset" aria-label="Reset map zoom">↺</button></div><div class="map-zoom-level" aria-live="polite">100%</div></div><p class="helper">Tap a state to answer. Pinch or use +/− to zoom, then drag to move the map.</p>`;
      const svg=d3.select(stage.querySelector("svg"));
      const layer=svg.select("[data-placement-map-layer]");
      const zoomLevel=stage.querySelector(".map-zoom-level");
      const zoom=d3.zoom().scaleExtent([1,7]).clickDistance(7).extent([[0,0],[580,356]]).translateExtent([[-60,-45],[640,401]]).filter(event=>event.type!=="wheel"||event.ctrlKey).on("zoom",event=>{
        layer.attr("transform",event.transform);
        zoomLevel.textContent=`${Math.round(event.transform.k*100)}%`;
        stage.classList.toggle("map-is-zoomed",event.transform.k>1.01);
      });
      svg.call(zoom).on("dblclick.zoom",null);
      $$('[data-map-zoom]',stage).forEach(button=>button.onclick=event=>{
        event.preventDefault();event.stopPropagation();
        const action=button.dataset.mapZoom;
        if(action==="reset")svg.transition().duration(180).call(zoom.transform,d3.zoomIdentity);
        else svg.transition().duration(180).call(zoom.scaleBy,action==="in"?1.6:1/1.6);
      });
      $$('[data-state-id]',stage).forEach(shape=>{
        shape.onclick=event=>{
          if(event.defaultPrevented||session.locked)return;
          const ok=shape.dataset.stateId===q.state.id;
          shape.classList.add(ok?'correct':'wrong');
          $$('[data-state-id]',stage).forEach(item=>{if(item.dataset.stateId===q.state.id)item.classList.add('correct');});
          if(!ok){const note=document.createElement('p');note.className='placement-correction';note.textContent=`Correct location: ${q.state.name} (${q.state.abbr})`;stage.appendChild(note);}
          finishAnswer(ok,q);
        };
        shape.ondragover=event=>event.preventDefault();
        shape.ondrop=event=>{event.preventDefault();shape.click();};
      });
      const chip=$('.state-drag-chip');
      chip?.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',q.state.id));
    }catch{stage.innerHTML=`<div class="feedback try">The placement map could not load. Reopen the app and try again.</div>`;}
  }
  async function renderStateMap(state){const stage=$("#mapStage");try{if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}const features=topojson.feature(mapTopology,mapTopology.objects.states).features;const feature=features.find(f=>String(f.id).padStart(2,'0')===state.id);const projection=d3.geoIdentity().reflectY(true).fitExtent([[18,14],[332,218]],feature);const path=d3.geoPath(projection);stage.innerHTML=`<svg viewBox="0 0 350 232" role="img" aria-label="Unlabeled state outline"><path d="${path(feature)}"></path></svg>`;}catch{stage.innerHTML=`<div class="feedback try">This state outline could not load. Try reopening the app.</div>`;}}
