var MapView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-map-details').html()),
	initialize: function(){
		this.render();
	},
	render: function(){
		var map = new google.maps.Map(document.getElementById("map-canvas"), { zoom: 12, center: {lat: 32.7663694, lng: -117.2592576} });
		var report = [];
		var ReportName = [];
		var ReportCast = [];
		$("#landing").hide();
		$(headerView.el).show();
		url = 'http://feeds.feedburner.com/surfline-rss-surf-report-south-san-diego?format=xml';
		$.ajax({
			type: "GET",
			url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
			dataType: 'jsonp',
			error: function(x,t,m){
				if(t==="timeout"){
					alert("received a timeout");
				}
			},
			success: function(xml){
			        values = xml.responseData.feed.entries;
				for(var i=0;i<16;i++){
					report = xml.responseData.feed.entries[i].title.split(':');
					reportTitle = report.shift();
					ReportName.push(reportTitle);
					ReportCast.push(report);
				}
	  			placeMarker("32.828746","242.719325","Windansea",ReportCast[ReportName.indexOf('WINDANSEA ')]);
	  			placeMarker("32.813788","242.727917","Birdrock",ReportCast[ReportName.indexOf('BIRDROCK ')]);
	  			placeMarker("32.794057","242.743063","Pacific Beach",ReportCast[ReportName.indexOf('PACIFIC BEACH ')]);
	  			placeMarker("32.771904","242.746682","Mission Beach",ReportCast[ReportName.indexOf('MISSION BEACH ')]);
	  			placeMarker("32.751839","242.746854","Ocean Beach",ReportCast[ReportName.indexOf('OCEAN BEACH, SD ')]);
	  			placeMarker("32.727039","242.743728","Sunset Cliffs",ReportCast[ReportName.indexOf('SUNSET CLIFFS ')]);
	  			placeMarker("32.804964","242.737635","Tourmaline",ReportCast[ReportName.indexOf('OLD MAN\'S/TOURMALINE ')]);
			}
	    	});
		function placeMarker(lat,lng,title,surf){
			var mylatlng = new google.maps.LatLng(lat,lng);
			var marker = new google.maps.Marker({
				position: mylatlng,
			    	map: map,
			    	icon: 'img/surf_icon40.png'
			})
			var infowindow = new google.maps.InfoWindow({
				content: 'Spot: ' + title +
				'<br>Surf: ' + surf 
		    	});
		    	//infowindow.open(map,marker);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
		    	});
		}
		return this;
	}
});
