(function() {
    var canvas = this.__canvas = new fabric.Canvas('c');


    window.addEventListener("keydown", (e) => {

      e.preventDefault();

      var _items =  canvas.getObjects();
      var _item = _items[0];

      if( e.keyCode == 37 ){
        _item.left -= 10;
      }else if( e.keyCode == 39 ){
        _item.left += 10;
      }
      
        console.log(e)
    } )

    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    fabric.Object.prototype.transparentCorners = false;
  
    // for (var i = 0, len = 5; i < len; i++) {
    //   for (var j = 0, jlen = 5; j < jlen; j++) {
    //     fabric.Sprite.fromURL('/img/sprite.png', createSprite(i, j));
    //   }
    // }
    fabric.Sprite.fromURL('/img/sprite.png', createSprite(0, 0));
  
    function createSprite(i, j) {
      return function(sprite) {
        sprite.set({
          left: i * 100 + 50,
          top: j * 100 + 50,
          angle: fabric.util.getRandomInt(-30, 30)
        });
        canvas.add(sprite);
        setTimeout(function() {
          sprite.set('dirty', true);
          sprite.play();
        }, fabric.util.getRandomInt(1, 10) * 100);
      };
    }
  
    (function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    })();



  })();