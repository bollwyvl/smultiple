;(function(d3){
  var fn = d3.functor,
    id = function(d){ return d; };

  this.smultiple = function smultiple(){
    // by default, make a square matix of all the data
    var _pts = id,
      _cols = function(d){ return Object.keys(d[0]); },
      _rows = function(d){ return Object.keys(d[0]); },
      _w = 1000,
      _h = 1000,
      _p = 10,
      _render = "svg",
      _tagRoot = "svg",
      _tagCell = "g",
      _clsCell = "sm-cell";

    var _scale = {
      cell: {
        x: d3.scale.ordinal(),
        y: d3.scale.ordinal()
      },
      x: {},
      y: {}
    };

    function makeScale(dir, item, pts){
      // really don't know why this is here...
      _scale.cell[dir](2);
      var scale = _scale[dir][item] = d3.scale.linear()
        .domain([0, d3.max(pts, function(d){ return d[item]; })])
        .range([0, _scale.cell[dir](1) - _p]);
      return scale;
    }

    function api(selection){
      var data = selection.datum(),
        pts = _pts(data),
        cols = _cols(pts),
        rows = _rows(pts);


      _scale.cell.x.domain(cols)
        .range(d3.range(0, _w, _w / cols.length));
      _scale.cell.y.domain(rows)
        .range(d3.range(0, _h, _h / rows.length));

      var container = selection.selectAll(".smultiple")
        .data([1])
        .call(function(smult){
          smult.enter().append(_tagRoot).classed({smultiple: 1});
        })
        .attr({
          width: _w,
          height: _h
        });

      var cellData = cols.reduce(function(m, col){
        return m.concat(rows.map(function(row){
          return {
            row: row,
            column: col,
            points: pts,
            x: _scale.x[col] || makeScale("x", col, pts),
            y: _scale.y[row] || makeScale("y", row, pts),
          };
        }));
      }, []);

      var cell = container.selectAll("." + _clsCell)
        .data(cellData)
        .call(function(cell){
          cell = cell.enter().append(_tagCell)
            .classed(_clsCell, 1)

          cell.append("rect")
            .classed(_clsCell + "-bg", 1)
            .attr({
              width: (_w / cols.length) - _p,
              height: (_h / rows.length) - _p
            });

          cell.append("g")
            .classed(_clsCell + "-content", 1);
        })
        .attr({transform: function(d){
          return "translate(" + [
            _scale.cell.x(d.row),
            _scale.cell.y(d.column)
          ]+ ")";
        }});

      return api;
    }

    api.columns = function columns(val){
      return arguments.length ? ((_cols = fn(val)) || 1) && api : _cols;
    };

    api.rows = function rows(val){
      return arguments.length ? ((_rows = fn(val)) || 1) && api : _rows;
    };

    api.points = function points(val){
      return arguments.length ? ((_pts = fn(val)) || 1) && api : _pts;
    };

    return api;
  };
}).call(this, d3);
