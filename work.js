$.getJSON( "./data.json", function( data ) {

    $(document).ready(function(){
      let size = data.data.length;
      console.log(data.data[0].colors.line1color);
      $("body").css("background",data.data[0].colors.background);
      $(".line1").text(data.data[0].text.line1)
        .css("color",data.data[0].colors.line1color);
      $(".line2").text(data.data[0].text.line2)
        .css("color",data.data[0].colors.line2color);
      $(".line3").text(data.data[0].text.line3)
        .css("color",data.data[0].colors.line3color);
      $("img").attr("src",data.data[0].imgsrc);
    });
    
});

