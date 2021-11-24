$.getJSON( "./data.json", function( data ) {


    $(document).ready(function(){
      let size = data.data.length;
      let i=0;
      firstAdv();
     
      let firstTime = data.data[0].duration*10000;
      var run = setInterval(request , firstTime); 
 
     // need to find how we fix the first interval twice.

      function request(){

        console.log(firstTime);

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
       
       
        
        clearInterval(run); 


        firstTime = data.data[i].duration*10000;

        if(i==size-1)
          i=0;
        else
          i++;    

        run = setInterval(request, firstTime);


      }

    });


});




//eden
function firstAdv(){
  $.getJSON( "./data.json", function( data ){
    console.log("first ad");
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
