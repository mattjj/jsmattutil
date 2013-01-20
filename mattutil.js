var mattutil = (function() {
my = {};

function setAll(v,a) {
    a = (a !== undefined) ? a : this;
    for (var i=0; i<a.length; i++) { a[i] = v; }
    return a;
}
Int32Array.prototype.setAll =
Float32Array.prototype.setAll =
Float64Array.prototype.setAll =
my.setAll =
setAll;

function sum(a) {
    a = (a !== undefined) ? a : this;
    var s = 0;
    for (var j=0; j<a.length; j++) { s += a[j]; }
    return s;
}
Int32Array.prototype.sum =
Float32Array.prototype.sum =
Float64Array.prototype.sum =
my.sum =
sum;

function toArray() {
    a = new Array(this.length);
    for (var i=0; i<this.length; i++) { a[i] = this[i]; }
    return a;
}
Int32Array.prototype.toArray =
Float32Array.prototype.toArray =
Float64Array.prototype.toArray =
toArray;

function randInt(high,low) {
    low = (low !== undefined) ? low : 0;
    return Math.floor(Math.random() * (high-low))+low;
}
my.randInt = randInt;

function sampleFrom(a) {
    var j, p;
    p = Math.random()*a.sum();
    for (j=0; j<a.length; j++) {
        if ((p -= a[j]) < 0) { return j; }
    }
    throw new Error();
}
my.sampleFrom = sampleFrom;

function shuffle(a) {
    a = (a !== undefined) ? a : this;
    var m=a.length, t, i;
    while (m) {
        i = randInt(m--);
        t = a[m];
        a[m] = a[i];
        a[i] = t;
    }
    return a;
}
Int32Array.prototype.shuffle =
Float32Array.prototype.shuffle =
Float64Array.prototype.shuffle =
my.shuffle =
shuffle;

function slice(start,end) {
    var ret = new this.constructor(end-start);
    for (var i=start; i<end; i++) { ret[i-start] = this[i]; }
    return ret;
}
Int32Array.prototype.slice =
Float32Array.prototype.slice =
Float64Array.prototype.slice =
slice;

function partition(cmp,a,left,right,pivotIndex) {
    var stack=left;
    swap(a,pivotIndex,right);
    for (var i=left; i<right; i++) {
        if (cmp(a[i],a[right])<0) {
            swap(a,i,stack++);
        }
    }
    swap(a,stack,right);
    return stack;
}

function swap(a,i,j) { var t = a[i]; a[i] = a[j]; a[j] = t; }

function topKDestructive(a,k,cmp) {
    if (a === undefined || k === undefined) { throw new TypeError('Not enough arguments'); }
    cmp = (cmp !== undefined) ? cmp : function(a,b) { return b-a; };

    function _argTopK(left,right,k) {
        if (right > left) {
            var pivotIndex = randInt(left,right+1);
            pivotNewIndex = partition(cmp,a,left,right,pivotIndex);
            if (pivotNewIndex > left + k) { _argTopK(left,pivotNewIndex-1,k); }
            if (pivotNewIndex < left + k) { _argTopK(pivotNewIndex+1,right,k-(pivotNewIndex-left+1)); }
        }
    }

    if (k >= a.length) {
        return a;
    } else {
        _argTopK(0,a.length-1,k);
        return a.slice(0,k);
    }
}
my.topKDestructive = topKDestructive;

function topK(a,k,cmp) { return topKDestructive(a.slice(0),k,cmp); }
my.topK = topK;

function range(N,a) {
    a = (a !== undefined) ? a : new Int32Array(N);
    for (var i=0; i<N; i++) { a[i] = i; }
    return a;
}
my.range = range;

return my;
})();
