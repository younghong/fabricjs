
var design;

start = () => {

    // create a wrapper around native canvas element (with id="c")
    this.design = new fabric.Canvas('c', {
        backgroundColor: 'rgb(218,100,200)',
        selectionColor: 'blue',
        selectionLineWidth: 2
        // ...
      });

    addScrollEvent();

    this.design.add(
        new fabric.Circle({ top: 140, left: 230, radius: 25, fill: 'green' }),
    );

    var path = new fabric.Path('M 0 0 L 20 0 L 20 20 z');
    path.set({ left: 120, top: 120 });
    this.design.add(path);

    var textWithStroke = new fabric.Text("Text with a stroke", {
        stroke: '#ff1318',
        strokeWidth: 1
      });
      var loremIpsumDolor = new fabric.Text("Lorem ipsum dolor", {
        fontFamily: 'Impact',
        stroke: '#c3bfbf',
        strokeWidth: 3
      });

      this.design.add(textWithStroke);
      this.design.add(loremIpsumDolor);
}

addScrollEvent = () => {

    this.design.on('mouse:wheel', function(opt) {
        var delta = opt.e.deltaY;
        var zoom = design.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        design.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();

        updateMiniMap();

      });


      this.design.on('mouse:down', function(options) {
        if (options.target) {
          console.log('an object was clicked! ', options.target.type);
          animation(options.target);
        }else{
            addRect(options.absolutePointer.x,options.absolutePointer.y);
        }
      });

}


animation = (target) => {

    // target.animate('left', 100, {
    //     onChange: this.canvas.renderAll.bind(this.canvas),
    //     duration: 1000,
    //     easing: fabric.util.ease.easeOutBounce
    //   });



      fabric.util.animate({
        startValue: target.left,
        endValue: target.left+50,
        duration: 1000,
        onChange: function(value) {
            target.left = value;
            design.renderAll();
        },

      });

}

function animate() {

    var max=400-design.item(0).height;

    design.item(0).animate('top', design.item(0).get('top') === max ? '0' : max, {
      duration: 1000,
      onChange: design.renderAll.bind(design),
      onComplete: animate
    });
  }



addRect = (x,y) => {
    // create a rectangle object
    var rect = new fabric.Rect({
        left: x,
        top: y,
        fill: 'red',
        width: 20,
        height: 20
    });

    // "add" rectangle onto canvas
    this.design.add(rect);
}



start();
animate();


var minimap = new fabric.Canvas('minimap',  { containerClass: 'minimap', selection: false });


function createCanvasEl() {
  var designSize = { width: 400, height: 400 };
  var originalVPT = design.viewportTransform;
  // zoom to fit the design in the display canvas
  var designRatio = fabric.util.findScaleToFit(designSize, design);

  // zoom to fit the display the design in the minimap.
  var minimapRatio = fabric.util.findScaleToFit(design, minimap);

  var scaling = minimap.getRetinaScaling();

  var finalWidth =  designSize.width * designRatio;
  var finalHeight =  designSize.height * designRatio;

  design.viewportTransform = [
    designRatio, 0, 0, designRatio,
    (design.getWidth() - finalWidth) / 2,
    (design.getHeight() - finalHeight) / 2
  ];
  var canvas = design.toCanvasElement(minimapRatio * scaling);
  design.viewportTransform = originalVPT;
  return canvas;
}

function updateMiniMap() {
  var canvas = createCanvasEl();
  minimap.backgroundImage._element = canvas;
  minimap.requestRenderAll();
}

function updateMiniMapVP() {
  var designSize = { width: 400, height: 400 };
  var rect = minimap.getObjects()[0];
  var designRatio = fabric.util.findScaleToFit(designSize, design);
  var totalRatio = fabric.util.findScaleToFit(designSize, minimap);
  var finalRatio = designRatio / design.getZoom();
  rect.scaleX = finalRatio;
  rect.scaleY = finalRatio;
  rect.top = minimap.backgroundImage.top - design.viewportTransform[5] * totalRatio / design.getZoom();
  rect.left = minimap.backgroundImage.left - design.viewportTransform[4] * totalRatio / design.getZoom();
  minimap.requestRenderAll();
}


function initMinimap() {
  var canvas = createCanvasEl();
  var backgroundImage = new fabric.Image(canvas);
  backgroundImage.scaleX = 1 / design.getRetinaScaling();
  backgroundImage.scaleY = 1 / design.getRetinaScaling();
  minimap.centerObject(backgroundImage);
  minimap.backgroundColor = 'white';
  minimap.backgroundImage = backgroundImage;
  minimap.requestRenderAll();
  var minimapView = new fabric.Rect({
    top: backgroundImage.top,
    left: backgroundImage.left,
    width: backgroundImage.width / design.getRetinaScaling(),
    height: backgroundImage.height/ design.getRetinaScaling(),
    fill: 'rgba(0, 0, 255, 0.3)',
    cornerSize: 6,
    transparentCorners: false,
    cornerColor: 'blue',
    strokeWidth: 0,
  });
  minimapView.controls = {
    br: fabric.Object.prototype.controls.br,
  };
  minimap.add(minimapView);
}

//var debouncedMiniMap = _.debounce(updateMiniMap, 250);

design.on('object:modified', function() {
  updateMiniMap();
})

initMinimap();
updateMiniMapVP();

