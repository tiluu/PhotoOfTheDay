jQuery(function($){

	var access_token = '4112123.f59def8.e61dd790f91c48e6803d18459723906a';
	var insta_url = "https://api.instagram.com/v1/tags/ootd/media/recent?callback=?";
	var next;


	function grab(tag){
		$.ajax(insta_url+tag, {
			data: {'access_token':access_token},
			dataType:'jsonp',
			success: dataLoaded
		});
	}
	function dataLoaded(instagram_data) {
		console.log(instagram_data);
		var info= instagram_data.data
		next="&max_tag_id="+instagram_data.pagination.next_max_tag_id

		

		for (i=0; info.length > i; i++ ){
			var photo = "<li><a href='" +info[i].link+ "'><img src='" +info[i].images.standard_resolution.url + "'</img></a></li>";
			$('#target').append(photo);
		}
	}
	
	grab();
	$('#next').click(function(){
		grab(next);
	})
	

});

