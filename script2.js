jQuery(function($){
	var access_token = '4112123.f59def8.e61dd790f91c48e6803d18459723906a';
	var location;
	var insta_url= "https://api.instagram.com/v1/locations/search?foursquare_v2_id=" ;
	var next;
	var insta_photo;


//Retrives photos from location and returns with location ids lat=48.858844&lng=2.294351&distance=5000
	function getLocation(location){
		$.ajax(insta_url+location, {
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
					photo = "<li><a href='" +data.link+ "'target=_blank><img src='" +data.images.standard_resolution.url + "'</img></a></li>";
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

	$('div#city button').click(function(){
		var city= $(this).attr('id');
		switch(city)
		{
			case "nyc":
			location="4acf58baf964a52028d320e3";
			break;

			case "sf":
			location="4c82f252d92ea09323185072";
			break;

			case "london":
			location="4e10c02045dde6c62dcd8b19";
			break;

			case "rome":
			location= "4e8bab8fb803540e781e7d03";
			break;

			case "bangkok":
			location= "50b5e9f7e4b009224db8f53d";
			break;

			case "madrid":
			location="4d683074d4c288bf50da7065";
			break;

			case "bangkok":
			location= "4d21b7010901721e2ff29ca5";
			break;

			case "mexico":
			location="4f3b7619e4b08082ae2bb300";
			break;
			case "sydney":
			location="5081ca91e4b0607ce86717c3";
			break;

			case "telaviv":
			location="4c4a3ca59c8d2d7febc63969";
			break;

			case "saopaulo":
			location = "4ce1b9a37e2e236af1e4911b";
			break;
		}
		getLocation(location);
	})
	
	$('#next').click(function(){
		grab(next);
	});
});
