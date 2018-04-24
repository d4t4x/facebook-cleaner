var clog = {
    fb: "color: rgb(80, 100, 220)",
    red: "color: red",
    magenta: "color: magenta",
    blue: "color: blue",
    teal: "color: teal",
    grey: "color: silver",
    lime: "color: lime",
    green: "color: #00FF80; background-color: #000",
    blue: "color: #0080FF; background-color: #000",
    blue2: "color: #19E8FF; background-color: #000",
    magenta: "color: #FF00B1; background-color: #000",
    yellow: "color: #FFFF00; background-color: #000",
    red: "color: #e91e53; background-color: #000"
};
module.exports = {
    clog: clog,
    now: function() {
        return moment().format();
    },
    escapeString: function(str) {
        // return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(/"/g, '\\"');
    },
    replaceAll: function(str, find, replace) {
        // http://stackoverflow.com/a/1144788
        return str.replace(new RegExp(this.escapeString(find), 'g'), replace);
    }
}
