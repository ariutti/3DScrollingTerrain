// this is the template for the sketch
var sketch = function(p) {

	let nOctaves = 6;
	var hscl = 8;
	var vscl = 50;
	//var lineWidth = scl;
	var fftSize = 128;

	// will be defined in setup
	let cols;
	var line;
	let spectrum;

	var terrain;
	var counter = 0;
	var rows = 8;

	// SETUP ////////////////////////////////////////////////////////////////////////
	p.setup = function() {
	  let cnv = p.createCanvas( p.windowWidth, p.windowHeight, p.WEBGL );
		p.setAttributes('antialias', true);
		p.frameRate(24)

		// audio stuff
		mic = new p5.AudioIn();
	  mic.start();
	  fft = new p5.FFT(0.8, fftSize); // smoothing, bins
		fft.setInput( mic );

		fft.analyze( scale="dB" );
		// get FFT grouped in logaritmic avarages according to the spectrum subdivided
		// in a specific number of octaves (15.625 is thr)
		spectrum = fft.logAverages( fft.getOctaveBands(nOctaves, 15.625) );
		for (let x = 0; x < spectrum.length; x++) {
			spectrum[x] = 0
	  }
		console.log("spectrum length: " + spectrum.length)
		cols = spectrum.length;

		terrain = new Array(cols);

	  // initialize terrain
	  for (let x = 0; x < cols; x++) {
			terrain[x] = new Array( rows );
	    for (let y = 0; y < rows; y++) {
	      terrain[x][y] = 0;
	    }
	  }

	}

	// DRAW /////////////////////////////////////////////////////////////////////////
	p.draw = function() {
	  p.background(0);

		p.updateBins();

		p.push()
		//p.noFill()
		p.stroke(255,0,0);

		p.translate(-spectrum.length*0.5*hscl, -200, 0 )
		p.rotateX( p.PI/4)

		for (let y = 0; y < rows-2; y++) {
			p.beginShape(  );
	    for (let x = 0; x < cols; x++) {
	      let lookupIndexA = ((rows-1 + counter - y) % rows);
	      //let lookupIndexB = ((rows-1 + counter - (y + 1)) % rows);
	      p.vertex(x*hscl, y*vscl,     terrain[x][ lookupIndexA ]);
				//p.vertex(x*hscl, (y+1)*vscl, terrain[x][ lookupIndexB ]);

	    }
			p.endShape();
	  }
		//move your mouse to change light direction
	  let dirX = (p.mouseX / p.width - 0.5) * 2;
	  let dirY = (p.mouseY / p.height - 0.5) * 2;
	  p.directionalLight(250, 250, 250, -dirX, -dirY, -1);
		p.pop()
	}


	// incoming osc message are forwarded to the oscEvent method.
	p.updateBins = function() {

		// draw spectrum
		// analyze must be called before any further FFT processing
		// NOTE: we are asking analyze to get amplitudes of each beans in a logarithmic fashon
		fft.analyze( scale="dB" );
		// get FFT grouped in logaritmic avarages according to the spectrum subdivided
		// in a specific number of octaves (15.625 is thr)
		spectrum = fft.logAverages( fft.getOctaveBands(nOctaves, 15.625) );
		for (let i = 0; i< spectrum.length; i++){
			if( spectrum[i] != null) {
				terrain[i][ counter ] = p.map(spectrum[i], -96, 0, 0, 100) ;
			}
	  }
		counter = (counter + 1) % rows;
	}

};
