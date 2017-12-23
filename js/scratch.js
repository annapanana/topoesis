$(() => {
  // Create SVG Canvas
  const mesh = d3.select("div#mesh").insert("svg", ":first-child")
                .attr("height", 1000)
                .attr("width", 1000)
                .attr("viewBox", "-500 -500 1000 1000");
  // Create mesh, change complexity with param
  const meshVxs = zero(generateGoodMesh(5000));
  // Add mountains, the numbers is the number of mtns added
  const meshWithMountains = add(meshVxs, mountains(meshVxs.mesh, 100));
  visualizeVoronoi(mesh, meshWithMountains, -1, 1);
})

var defaultExtent = {
    width: 1,
    height: 1
};


function generateGoodMesh(n, extent) {
    extent = extent || defaultExtent;
    var pts = generatePoints(n, extent);
    return makeMesh(pts, extent);
}


function generatePoints(n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
        pts.push([(Math.random() - 0.5), (Math.random() - 0.5)]);
    }
    return pts;
}

function visualizePoints(svg, pts) {
    var circle = svg.selectAll('circle').data(pts);
    circle.enter()
        .append('circle');
    circle.exit().remove();
    d3.selectAll('circle')
        .attr('cx', function (d) {return 1000*d[0]})
        .attr('cy', function (d) {return 1000*d[1]})
        .attr('r', 100 / Math.sqrt(pts.length));
}

function makeMesh(pts, extent) {
    extent = extent || defaultExtent;
    var vor = voronoi(pts, extent);
    var vxs = [];
    var vxids = {};
    var adj = [];
    var edges = [];
    var tris = [];
    for (var i = 0; i < vor.edges.length; i++) {
        var e = vor.edges[i];
        if (e == undefined) continue;
        var e0 = vxids[e[0]];
        var e1 = vxids[e[1]];
        if (e0 == undefined) {
            e0 = vxs.length;
            vxids[e[0]] = e0;
            vxs.push(e[0]);
        }
        if (e1 == undefined) {
            e1 = vxs.length;
            vxids[e[1]] = e1;
            vxs.push(e[1]);
        }
        adj[e0] = adj[e0] || [];
        adj[e0].push(e1);
        adj[e1] = adj[e1] || [];
        adj[e1].push(e0);
        edges.push([e0, e1, e.left, e.right]);
        tris[e0] = tris[e0] || [];
        if (!tris[e0].includes(e.left)) tris[e0].push(e.left);
        if (e.right && !tris[e0].includes(e.right)) tris[e0].push(e.right);
        tris[e1] = tris[e1] || [];
        if (!tris[e1].includes(e.left)) tris[e1].push(e.left);
        if (e.right && !tris[e1].includes(e.right)) tris[e1].push(e.right);
    }

    var mesh = {
        pts: pts,
        vor: vor,
        vxs: vxs,
        adj: adj,
        tris: tris,
        edges: edges,
        extent: extent
    }
    mesh.map = function (f) {
        var mapped = vxs.map(f);
        mapped.mesh = mesh;
        return mapped;
    }
    return mesh;
}


function voronoi(pts, extent) {
    extent = extent || defaultExtent;
    var w = extent.width/2;
    var h = extent.height/2;
    return d3.voronoi().extent([[-w, -h], [w, h]])(pts);
}

function visualizeVoronoi(svg, field, lo, hi) {
    if (hi == undefined) hi = d3.max(field) + 1e-9;
    if (lo == undefined) lo = d3.min(field) - 1e-9;
    var mappedvals = field.map(function (x) {return x > hi ? 1 : x < lo ? 0 : (x - lo) / (hi - lo)});
    var tris = svg.selectAll('path.field').data(field.mesh.tris)
    tris.enter()
        .append('path')
        .classed('field', true);
    
    tris.exit()
        .remove();

    svg.selectAll('path.field')
        .attr('d', makeD3Path)
        .style('fill', function (d, i) {
            return d3.interpolateViridis(mappedvals[i]);
        });
}

function zero(mesh) {
    var z = [];
    for (var i = 0; i < mesh.vxs.length; i++) {
        z[i] = 0;
    }
    z.mesh = mesh;
    return z;
}

function mountains(mesh, n, r) {
    r = r || 0.05;
    var mounts = [];
    for (var i = 0; i < n; i++) {
        mounts.push([mesh.extent.width * (Math.random() - 0.5), mesh.extent.height * (Math.random() - 0.5)]);
    }
    var newvals = zero(mesh);
    for (var i = 0; i < mesh.vxs.length; i++) {
        var p = mesh.vxs[i];
        for (var j = 0; j < n; j++) {
            var m = mounts[j];
            newvals[i] += Math.pow(Math.exp(-((p[0] - m[0]) * (p[0] - m[0]) + (p[1] - m[1]) * (p[1] - m[1])) / (2 * r * r)), 2);
        }
    }
    return newvals;
}

function add() {
    var n = arguments[0].length;
    var newvals = zero(arguments[0].mesh);
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < arguments.length; j++) {
            newvals[i] += arguments[j][i];
        }
    }
    return newvals;
}

function makeD3Path(path) {
    var p = d3.path();
    p.moveTo(1000*path[0][0], 1000*path[0][1]);
    for (var i = 1; i < path.length; i++) {
        p.lineTo(1000*path[i][0], 1000*path[i][1]);
    }
    return p.toString();
}