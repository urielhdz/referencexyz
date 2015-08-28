$(document).ready(function(){
	var resultados = "";
  $('#buscador').submit(function (e)  { // This event fires when a button is clicked
  	e.preventDefault(); 
  	var valor= $('#input-b').val();
	$.ajax({ // ajax call starts
		url: '/search', // JQuery loads serverside.php
		data: 'keyword=' + valor, // Send value of the clicked button
		dataType: 'json', // Choosing a JSON datatype
	})
	.done(function(data) { // Variable data contains the data we get from serverside
		resultados = data;
		if(resultados.length != 0){
			console.log(resultados);
			$('#resultados').html(''); // Clear #resultados div
			var html = " <div>";
			html += "<ul style='padding-left: 20px; padding-top: 20px'>";
			for (var i = resultados.length - 1; i >= 0; i--) {
				html += "<li >";
				var resultado = resultados[i];
				html += "<a style='color: blue; list-style:none;' href='/propiedades/"+resultado.slug+"'>"+resultado.title+"</a>";
				html += "</li>";
			};
			html += "</ul>";
			html +="</div>";
	    $("#resultados").html(html);
		}else{
			$('#resultados').html(''); // Clear #resultados div
			    var html = "<p style='color: black; padding-top: 15px;'>No se ha encontrado la propiedad</p>";
			    console.log("else");
			    $("#resultados").html(html);
		} 
		$("#myModal2").modal("show");	
	});
		
 });
}); 	