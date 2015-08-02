/*
  # smultiple: small multiples for d3

  smultiple follows the [Reusable Charts](http://bost.ocks.org/mike/chart/)
  pattern to help you visualize multi-variate data simply.
*/
;(function(d3){
  // convenience functions/aliases
  var fn = d3.functor,
    id = function(d){ return d; };

  d3.layout.smultiple = function smultiple(){
    // factories for getting back the layout dimensions (rows, columns, points)
    // from the data


    var _getter = function(attr){
        return function(d){ return d[attr]; };
      },
      _sortedItemKeys = function(d){
        var keys = d3.keys(d[0]);
        keys.sort(d3.ascending());
        return keys;
      };

    var _pts = id,
      _cols = _sortedItemKeys,
      _rows = _sortedItemKeys;

      // width, height and padding
      _w = 800,
      _h = 800,
      _p = 5,

      // TODO: allow for HTML rendering
      _render = "svg",
      _tagRoot = "svg",
      _tagCell = "g",
      _clsCell = "sm-cell",

      // TODO: per-dimension scale types (log, etc.)
      _scale = {
        cell: {
          x: d3.scale.ordinal(),
          y: d3.scale.ordinal()
        }
      },

      _makeScale = function(axis, item, pts){
        // really don't know why this is here...
        _scale.cell[axis](2);

        var scale,
          vals = pts.map(_getter(item)),
          cellDim = _scale.cell[axis](1) - _p;

        switch(typeof vals[0]){
          case "number":
            scale = d3.scale.linear()
              .domain(d3.extent(vals))
              .range([0, cellDim]);
            break;
          case "string":
            vals = d3.set(vals).values();
            vals.sort(d3.ascending());
            var step = cellDim / vals.length;

            scale = d3.scale.ordinal()
              .domain(vals)
              .range(vals.map(function(d, i){ return i * step; }));
        }


        return (_scale[axis][item] = scale);
      };

    function api(selection){
      var data = selection.datum(),
        pts = _pts(data),
        cols = _cols(pts),
        rows = _rows(pts);

      _scale.cell.x.domain(cols)
        .range(d3.range(0, _w, _w / cols.length));
      _scale.cell.y.domain(rows)
        .range(d3.range(0, _h, _h / rows.length));

      _scale.x = {};
      _scale.y = {};

      var container = selection.selectAll(".smultiple")
        .data([1])
        .call(function(smult){
          smult.enter().append(_tagRoot)
            .classed({smultiple: 1});
        })
        .attr({
          width: _w,
          height: _h
        });

      // apply the cell data transformation... create scales as side effect
      var cellData = cols.reduce(function(m, col){
        return m.concat(rows.map(function(row){
          return {
            row: row,
            column: col,
            data: pts,
            x: _scale.x[col] || _makeScale("x", col, pts),
            y: _scale.y[row] || _makeScale("y", row, pts),
          };
        }));
      }, []);

      var cell = container.selectAll("." + _clsCell)
        .data(cellData, function(cell){
          return [cell.row, cell.column];
        })

        // enter
        .call(function(cell){
          cell = cell.enter().append(_tagCell)
            .classed(_clsCell, 1)

          cell.append("rect")
            .classed(_clsCell + "-bg", 1)

          cell.append("g")
            .classed(_clsCell + "-content", 1);
        })

        //update
        .call(function(cell){
          cell.attr({transform: function(d){
            return "translate(" + [
              _scale.cell.x(d.row),
              _scale.cell.y(d.column)
            ]+ ")";
          }});

          cell.select("." + _clsCell + "-bg").attr({
            width: (_w / cols.length) - _p,
            height: (_h / rows.length) - _p
          });
        })
        // exit
        .call(function(cell){
          cell.exit().remove();
        });

      // chain!
      return api;
    }

    // d3-getter/setters
    api.data = function data(val){
      return arguments.length ? ((_pts = fn(val)) || 1) && api : _pts;
    };

    api.get = function get(val){
      return arguments.length ? ((_getter = val) || 1) && api : _getter;
    }

    api.columns = function columns(val){
      return arguments.length ? ((_cols = fn(val)) || 1) && api : _cols;
    };

    api.rows = function rows(val){
      return arguments.length ? ((_rows = fn(val)) || 1) && api : _rows;
    };

    api.width = function width(val){
      return arguments.length ? ((_w = val) || 1) && api : _w;
    };

    api.height = function height(val){
      return arguments.length ? ((_h = val) || 1) && api : _h;
    };

    api.padding = function padding(val){
      return arguments.length ? ((_p = val) || 1) && api : _p;
    };

    // chain!
    return api;
  };
}).call(this, d3);
