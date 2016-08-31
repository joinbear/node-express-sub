const express = require('express');
const router  = express.Router();

router.get('/',(req,res)=> {
	res.end('this is admin app demo page');
});

module.exports = router;