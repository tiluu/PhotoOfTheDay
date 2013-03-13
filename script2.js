jQuery(function($){
	var access_token = '4112123.f59def8.e61dd790f91c48e6803d18459723906a';
	var locationID;
	var next;
	var data;
	var insta_url = "https://api.instagram.com/v1/locations/search?foursquare_v2_id=";
	var location;
	var fetching = null;

	$('nav#city a').click(function(){
		location= $(this).data('city');
		next= " ";
			getLocation(location);
	})

//Retrives photos from location with location ids 
function getLocation(location){
		$.ajax(insta_url+location, {
			data: {'access_token':access_token},
			dataType:'jsonp',
			beforeSend: function(){
				$('div#loader img').show();
				$("div#target div").remove();
			},
			success: dataLoaded
		});
	}
	
	function dataLoaded(instagramData){
		console.log(instagramData);
		$.each(instagramData.data, function(index, locationID){
			var locationID = locationID.id; 
				insta_photo = "https://api.instagram.com/v1/locations/" +locationID+ "/media/recent?";
				$.ajax(insta_photo, {
					data: {'access_token':access_token},
					dataType:'jsonp',
					success: getPhoto
				});
			}
		)
	}


//Takes the media and find each image to add to html, assigns var next with pagination id. 
	function getPhoto(pics){
		console.log(pics);
		next="&max_id="+pics.pagination.next_max_id;
		data=pics.data.length
		$.each(pics.data, function(index, data){
			tag=data.tags
			for(i=0; i<=tag.length; i++){
				if(tag[i]=="photooftheday"){
					$('div#loader img').hide();
					photo = "<div><a href='" +data.link+ "'target=_blank><img src='" +data.images.standard_resolution.url + "'></a></div>";
					$('#target').append(photo);	
				}
			}
		});
		if(true){
			grab(next);
		}
	}
	//Uses var next to grab the next set of data. 
	function grab(next){
		if(fetching) {
			fetching.abort();
		}
		fetching = $.ajax(insta_photo+next, {
			data: {'access_token':access_token},
			dataType:'jsonp',
			success: getPhoto,
			complete: fetching= null
		});
	}
	
	$('#next').click(function(){

	});
});
