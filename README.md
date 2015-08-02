# smultiple
> a small multiple layout for d3

## Usage

```html
<!-- include d3 first -->
<script src="./d3.min.js"></script>
<script src="./smultiple.js"></script>
<script>
  var sm = d3.layout.smultiple();

  d3.select("something")
    .data([some, data])
    .call(sm)
    .selectAll(".sm-cell")
    .each(function(cell){
      /* cell is: {
        column: "key",
           row: "other-key",
             x: scaleForColumn()
             y: scaleForRow()
          data: [{the: original, point: data}, ...]
      } */
      var content = d3.select(this).select(".sm-cell-content");
    });
</script>
```

## API

### `d3.layout.smultiple()`
Create an instance of smultiple: the returned value is used against
a bound d3 selection, such as:

``` javascript
var smultiple = d3.layout.smultiple();

d3.select("#foo").data([]).call(smultiple)
// same as
smultiple(d3.select("#foo").data([]))
```

An inner wrapper SVG with the class `smultiple` will be appended.

### `smultiple` Instance

#### `.columns(`array | function(data)`)`
#### `.rows(`array | function(data)`)`
Get/set accessor/names of attributes to be retrieved from each point
in:
 - building the grid of multiples
 - scales and axes

Can also be a function which will take the whole data set and return
an array of strings

_default: the sorted keys of the first bound datum_

#### `.width(`number`)`
#### `.height(`number`)`
Get/set the dimension of the wrapper SVG.

_default: 800_

#### `.padding(`number`)`
Get/set the padding between cells.

_default: 5_

#### advanced data stuff

##### `.get(`function(attr)`)`
Provide a function that accepts a column/row and returns an accessor
for a point value: defaults to regular direct access, i.e. `d[attr]`, but could be overridden to hand `d.get(attr)`, etc.

__default__

##### `.data(`array | function(data)`)`
A transformer to find the point data within the data that is bound
to the selection. If you just bind to an array, you won't need this,
but can be used if you would normally call a function to get the data.
