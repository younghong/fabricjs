
var canvas;

start = () => {

    // create a wrapper around native canvas element (with id="c")
    this.canvas = new fabric.Canvas('c', {
        backgroundColor: 'rgb(100,100,200)',
        selectionColor: 'blue',
        selectionLineWidth: 2
        // ...
      });

    addScrollEvent();

    this.canvas.add(
        new fabric.Circle({ top: 140, left: 230, radius: 25, fill: 'green' }),
    );

    var path = new fabric.Path('M 0 0 L 20 0 L 20 20 z');
    path.set({ left: 120, top: 120 });
    this.canvas.add(path);

    var textWithStroke = new fabric.Text("Text with a stroke", {
        stroke: '#ff1318',
        strokeWidth: 1
      });
      var loremIpsumDolor = new fabric.Text("Lorem ipsum dolor", {
        fontFamily: 'Impact',
        stroke: '#c3bfbf',
        strokeWidth: 3
      });

      this.canvas.add(textWithStroke);
      this.canvas.add(loremIpsumDolor);
}

addScrollEvent = () => {

    this.canvas.on('mouse:wheel', function(opt) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });


      this.canvas.on('mouse:down', function(options) {
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
            canvas.renderAll();
        },

      });

}

function animate() {

    var max=400-canvas.item(0).height;

    canvas.item(0).animate('top', canvas.item(0).get('top') === max ? '0' : max, {
      duration: 1000,
      onChange: canvas.renderAll.bind(canvas),
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
    this.canvas.add(rect);
}



start();
animate();