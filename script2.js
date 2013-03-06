jQuery(function($){
	var access_token = '4112123.f59def8.e61dd790f91c48e6803d18459723906a';
	var insta_url= "https://api.instagram.com/v1/locations/search?foursquare_v2_id=4acf58baf964a52028d320e3";
	var next;
	var insta_photo;
	
//Retrives photos from location and returns with location ids
	function getLocation(){
		$.ajax(insta_url, {
			data: {'access_token':access_token},
			dataType:'jsonp',
			success: dataLoaded
		});
	}
//For each location information return, location ID is extracted and used to find media information
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
//Uses var next to grab the next set of data. 
	function grab(next){
		$.ajax(insta_photo+next, {
			data: {'access_token':access_token},
			dataType:'jsonp',
			success: getPhoto
		});
	}

//Takes the media and find each image to add to html, assigns var next with pagination id. 
	function getPhoto(pics){
		console.log(pics);
		next="&max_id="+pics.pagination.next_max_id;
		var imageCount=false;
		$.each(pics.data, function(index, data){
			tag=data.tags
			for(i=0; i<=tag.length; i++){
				if(tag[i]=="photooftheday"){
					photo = "<li><a href='" +data.link+ "'><img src='" +data.images.standard_resolution.url + "'</img></a></li>";
					$('#target').append(photo);	
					imageCount = true
				}
			}
		});
//If there isn't a tag in the data that we are looking for, it will continue to run the grab(); until an image is found.
		if(imageCount!=true){
			grab(next);
		}
	}
	
	getLocation();
	$('#next').click(function(){
		grab(next);
	});
});
