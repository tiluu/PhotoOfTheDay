jQuery(function($){
	var client_id = '5b7595aa855c4ba5a78e34b9528b83ba' //'4112123.f59def8.e61dd790f91c48e6803d18459723906a';
	, hashTag="photooftheday"
	, next
	, insta_url = "https://api.instagram.com/v1/locations/search?foursquare_v2_id="
	, fetching = null
	, counter=0
	, insta_photo
	, header = $('nav').offset().top

	$('a').hover(function(){
			$(this).toggleClass('highlight');
		})

	$('nav a').click(function(){
		var location= $(this).data('city');
		next= " ";
		$('a.current').removeClass('current');
		$(this).addClass('current')
		if(fetching) {
			fetching.abort();
		}

		getLocation(location);
		
	})
	//selects nyc as default view
	$('nav a:eq(0)').click();

	$(window).scroll(function(){
		if($(window).scrollTop()+$(window).height() > $(document).height()-600){
			counter=0;
			grab(next);
		}
		if ($(window).scrollTop() > header){
			$('nav').addClass('city');
		} else {
			$('nav').removeClass('city')
		}
	});

	$('div#target div').load(function(){
		$('div#target div').fadeIn(2000);
	})

//Retrives photos from location with location ids 
function getLocation(location){
		$.ajax(insta_url+location, {
			data: {'client_id':client_id},
			dataType:'jsonp',
			beforeSend: function(){
				
				$("div#target div").remove();
				counter=0;
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
					data: {'client_id':client_id},
					dataType:'jsonp',
					success: getPhoto
				});
			}
		)
	}


//Takes the media and find each image to add to html, assigns var next with pagination id. 
	function getPhoto(pics){
		var data;
		console.log(pics);

		next = "&max_id="+pics.pagination.next_max_id;
		data = pics.data.length
		$('div#loader img').hide();
		$.each(pics.data, function(index, data){
			tag=data.tags
			for(i=0; i<=tag.length; i++){
				if(tag[i]==hashTag){
					photo = "<div><a href='" +data.link+ "'target=_blank><img src='" +data.images.standard_resolution.url + "'></a></div>";
					$('#target').append(photo);

					counter++;
				}
			}
		});
		
		if(counter<=11){
			grab(next);	
		}
		
	}
	//Uses var next to grab the next set of data. 
	function grab(next){
		if(fetching) {
			fetching.abort();
		}
		fetching = $.ajax(insta_photo+next, {
			data: {'client_id':client_id},
			dataType:'jsonp',
			beforeSend: function(){
						$('div#loader img').show();
					},
			success: getPhoto,
			complete: fetching= null
		});
	}

});
