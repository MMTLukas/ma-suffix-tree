var valuesX = ['x', 641718, 909178, 1504095, 1761759, 2108091];
var valuesY = ['Ukkonen', 2812345998, 4009347282, 7198619187, 8334657959, 10602744602]


var c = 5030;
var valuesC = ['c*n (c=5030)', 641718 * c, 909178 * c, 1504095 * c, 1761759 * c, 2108091 * c];

window.onload = function () {
  var chart = c3.generate({
    bindto: '#chart',
    padding: {
      top: 10,
      right: 20
    },
    size: {
      height: 600
    },
    data: {
      x: 'x',
      columns: [
        valuesX,
        valuesY,
        valuesC,
      ],
      labels: {
        format: function (v, id, i, j) {
          return (v / 1000000000).toFixed(2) + " sec";
        }
      }
    },
    axis: {
      y: {
        label: {
          text: "Duration [sec]",
          position: "outer-middle"
        },
        tick: {
          format: function (v, id, i, j) {
            return (v / 1000000000).toFixed(2);
          }
        }
      },
      x: {
        label: {
          text: "Number of books",
          position: "outer-center"
        }
      }
    },
    grid: {
      x: {
        show: true
      },
      y: {
        show: true
      }
    }
  });
};