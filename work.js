$.getJSON( "./data.json", function( data ) {

    $(document).ready(function(){
      let size = data.data.length;
      let i=1;
      firstAdv();
      setInterval(function(){
        $("body").css("background",data.data[i].colors.background);
        $(".line1").text(data.data[i].text.line1)
          .css("color",data.data[i].colors.line1color);
        $(".line2").text(data.data[i].text.line2)
          .css("color",data.data[i].colors.line2color);
        $(".line3").text(data.data[i].text.line3)
          .css("color",data.data[i].colors.line3color);
        $(".line4").text(data.data[i].text.line4)
          .css("color",data.data[i].colors.line4color);
          $("img").attr("src",data.data[i].imgsrc);
          if(i==size-1)
            i=0;
          else
            i++;
      },3000);
    });
});

function firstAdv(){
  $.getJSON( "./data.json", function( data ){
    $("body").css("background",data.data[0].colors.background);
    $(".line1").text(data.data[0].text.line1)
      .css("color",data.data[0].colors.line1color);
    $(".line2").text(data.data[0].text.line2)
      .css("color",data.data[0].colors.line2color);
    $(".line3").text(data.data[0].text.line3)
      .css("color",data.data[0].colors.line3color);
    $(".line4").text(data.data[0].text.line4)
      .css("color",data.data[0].colors.line4color);
      $("img").attr("src",data.data[0].imgsrc);
  });
}
