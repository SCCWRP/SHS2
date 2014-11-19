var MapView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-map-details').html()),
	initialize: function(){
		this.render();
	},
	render: function(){
		console.log("map");
		var map = new google.maps.Map(document.getElementById("map-canvas-test"), { zoom: 12, center: {lat: 32.7663694, lng: -117.2592576} });
		var report = [];
		//var ReportName = [];
		//var ReportCast = [];
		//var surfReport = [{id: 1,title: "WINDANSEA",surf: "", latlng: "32.828746,242.719325"},{id: 2, title: "TOURMALINE",surf: "", latlng: "32.828746,242.719325"}];
		var surfReport = {};
		surfReport[0] = ['WINDANSEA','32.828746,242.719325'];
		surfReport[1] = ['TOURMALINE','32.828746,242.719325'];
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
				//console.log(values);
				//console.log(surfReport[0].id);
				for(var i=0;i<16;i++){
					report = xml.responseData.feed.entries[i].title.split(':');
					console.log(surfReport[0].indexOf(report[0].trim()));
					//console.log(report[0].trim());
					//console.log(surfReport[0][0]);
					//if(surfReport[0][0] === report[0]){
						//console.log("yes");
					//}
					//reportSpot = report.shift();
					//console.log(reportSpot);
					//ReportSpot.push(reportSpot);
					//ReportReport.push(report);
				}
				//console.log(ReportName);
				//console.log(ReportCast);
				//console.log(ReportCast[ReportName.indexOf('WINDANSEA ')]);
				return report;
			}
	    	});
		console.log(report);
		var mylatlng = new google.maps.LatLng(32.828746,242.719325);
	  	placeMarker(mylatlng,"windandsea","2-3ft");
		function placeMarker(location,title,surf){
			console.log("placeMarker");
			console.log(location);
			var marker = new google.maps.Marker({
				position: location,
			    	map: map,
			})
			var infowindow = new google.maps.InfoWindow({
				//content: 'Latitude: ' + location.lat() +
			 	//'<br>Longitude: ' + location.lng()
				content: 'Spot: ' + title +
				'<br>Surf: ' + surf 
		    	});
		    	infowindow.open(map,marker);
		}
		//.bindPopup("<b>Windansea</b><br />" + ReportCast[ReportName.indexOf('WINDANSEA ')] + "").openPopup();
		//$('#question').html("Map");
		//$(this.el).html("");
		//$(this.el).html(this.template());	
		/*
		map = new google.maps.Map(document.getElementById("map-canvas-test"), { zoom: 12, center: {lat: 32.7663694, lng: -117.2592576} });
		map.data.loadGeoJson('surfspots.json');
	 	map.data.addListener ('click', function(event) {
	      		document.getElementById ('info-box').textContent =
		  	event.feature.getProperty('url');
		}); 
		*/
		return this;
	}
});
