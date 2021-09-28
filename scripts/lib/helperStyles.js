function render() {
	var s = `<style type="text/css">input[type=button] {
  background: #54c200;
  background-image: -webkit-linear-gradient(top, #54c200, #54c200);
  background-image: -moz-linear-gradient(top, #54c200, #54c200);
  background-image: -ms-linear-gradient(top, #54c200, #54c200);
  background-image: -o-linear-gradient(top, #54c200, #54c200);
  background-image: linear-gradient(to bottom, #54c200, #54c200);
  -webkit-border-radius: 5;
  -moz-border-radius: 5;
  border-radius: 5px;
  font-family: Arial;
  color: #ffffff;
  font-size: 16px;
  padding: 10px 20px 10px 20px;
  border: solid #ffffff 1px;
  text-decoration: none;
}

}</style>`;

return s;
}

module.exports.render = render;