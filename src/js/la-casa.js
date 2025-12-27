import lightGallery from 'lightgallery';
import 'lightgallery/css/lightgallery.css';

import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

lightGallery(document.getElementById('laCasaGallery'), {
  plugins: [lgZoom, lgThumbnail],
  speed: 400,
});
