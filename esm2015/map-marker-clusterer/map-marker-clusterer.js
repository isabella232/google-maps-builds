/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
/// <reference path="marker-clusterer-types.ts" />
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgZone, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { MapMarker } from '../map-marker/map-marker';
/** Default options for a clusterer. */
const DEFAULT_CLUSTERER_OPTIONS = {};
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export class MapMarkerClusterer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._currentMarkers = new Set();
        this._eventManager = new MapEventManager(this._ngZone);
        this._destroy = new Subject();
        this.ariaLabelFn = () => '';
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/
         * _google_markerclustererplus.html#clusteringbegin
         */
        this.clusteringbegin = this._eventManager.getLazyEmitter('clusteringbegin');
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
         */
        this.clusteringend = this._eventManager.getLazyEmitter('clusteringend');
        this._canInitialize = this._googleMap._isBrowser;
    }
    set averageCenter(averageCenter) {
        this._averageCenter = averageCenter;
    }
    set batchSizeIE(batchSizeIE) {
        this._batchSizeIE = batchSizeIE;
    }
    set calculator(calculator) {
        this._calculator = calculator;
    }
    set clusterClass(clusterClass) {
        this._clusterClass = clusterClass;
    }
    set enableRetinaIcons(enableRetinaIcons) {
        this._enableRetinaIcons = enableRetinaIcons;
    }
    set gridSize(gridSize) {
        this._gridSize = gridSize;
    }
    set ignoreHidden(ignoreHidden) {
        this._ignoreHidden = ignoreHidden;
    }
    set imageExtension(imageExtension) {
        this._imageExtension = imageExtension;
    }
    set imagePath(imagePath) {
        this._imagePath = imagePath;
    }
    set imageSizes(imageSizes) {
        this._imageSizes = imageSizes;
    }
    set maxZoom(maxZoom) {
        this._maxZoom = maxZoom;
    }
    set minimumClusterSize(minimumClusterSize) {
        this._minimumClusterSize = minimumClusterSize;
    }
    set styles(styles) {
        this._styles = styles;
    }
    set title(title) {
        this._title = title;
    }
    set zIndex(zIndex) {
        this._zIndex = zIndex;
    }
    set zoomOnClick(zoomOnClick) {
        this._zoomOnClick = zoomOnClick;
    }
    set options(options) {
        this._options = options;
    }
    ngOnInit() {
        if (this._canInitialize) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.markerClusterer = new MarkerClusterer(this._googleMap.googleMap, [], this._combineOptions());
            });
            this._assertInitialized();
            this._eventManager.setTarget(this.markerClusterer);
        }
    }
    ngAfterContentInit() {
        if (this._canInitialize) {
            this._watchForMarkerChanges();
        }
    }
    ngOnChanges(changes) {
        const { markerClusterer: clusterer, ariaLabelFn, _averageCenter, _batchSizeIE, _calculator, _styles, _clusterClass, _enableRetinaIcons, _gridSize, _ignoreHidden, _imageExtension, _imagePath, _imageSizes, _maxZoom, _minimumClusterSize, _title, _zIndex, _zoomOnClick } = this;
        if (clusterer) {
            if (changes['options']) {
                clusterer.setOptions(this._combineOptions());
            }
            if (changes['ariaLabelFn']) {
                clusterer.ariaLabelFn = ariaLabelFn;
            }
            if (changes['averageCenter'] && _averageCenter !== undefined) {
                clusterer.setAverageCenter(_averageCenter);
            }
            if (changes['batchSizeIE'] && _batchSizeIE !== undefined) {
                clusterer.setBatchSizeIE(_batchSizeIE);
            }
            if (changes['calculator'] && _calculator) {
                clusterer.setCalculator(_calculator);
            }
            if (changes['clusterClass'] && _clusterClass !== undefined) {
                clusterer.setClusterClass(_clusterClass);
            }
            if (changes['enableRetinaIcons'] && _enableRetinaIcons !== undefined) {
                clusterer.setEnableRetinaIcons(_enableRetinaIcons);
            }
            if (changes['gridSize'] && _gridSize !== undefined) {
                clusterer.setGridSize(_gridSize);
            }
            if (changes['ignoreHidden'] && _ignoreHidden !== undefined) {
                clusterer.setIgnoreHidden(_ignoreHidden);
            }
            if (changes['imageExtension'] && _imageExtension !== undefined) {
                clusterer.setImageExtension(_imageExtension);
            }
            if (changes['imagePath'] && _imagePath !== undefined) {
                clusterer.setImagePath(_imagePath);
            }
            if (changes['imageSizes'] && _imageSizes) {
                clusterer.setImageSizes(_imageSizes);
            }
            if (changes['maxZoom'] && _maxZoom !== undefined) {
                clusterer.setMaxZoom(_maxZoom);
            }
            if (changes['minimumClusterSize'] && _minimumClusterSize !== undefined) {
                clusterer.setMinimumClusterSize(_minimumClusterSize);
            }
            if (changes['styles'] && _styles) {
                clusterer.setStyles(_styles);
            }
            if (changes['title'] && _title !== undefined) {
                clusterer.setTitle(_title);
            }
            if (changes['zIndex'] && _zIndex !== undefined) {
                clusterer.setZIndex(_zIndex);
            }
            if (changes['zoomOnClick'] && _zoomOnClick !== undefined) {
                clusterer.setZoomOnClick(_zoomOnClick);
            }
        }
    }
    ngOnDestroy() {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this.markerClusterer) {
            this.markerClusterer.setMap(null);
        }
    }
    fitMapToMarkers(padding) {
        this._assertInitialized();
        this.markerClusterer.fitMapToMarkers(padding);
    }
    getAverageCenter() {
        this._assertInitialized();
        return this.markerClusterer.getAverageCenter();
    }
    getBatchSizeIE() {
        this._assertInitialized();
        return this.markerClusterer.getBatchSizeIE();
    }
    getCalculator() {
        this._assertInitialized();
        return this.markerClusterer.getCalculator();
    }
    getClusterClass() {
        this._assertInitialized();
        return this.markerClusterer.getClusterClass();
    }
    getClusters() {
        this._assertInitialized();
        return this.markerClusterer.getClusters();
    }
    getEnableRetinaIcons() {
        this._assertInitialized();
        return this.markerClusterer.getEnableRetinaIcons();
    }
    getGridSize() {
        this._assertInitialized();
        return this.markerClusterer.getGridSize();
    }
    getIgnoreHidden() {
        this._assertInitialized();
        return this.markerClusterer.getIgnoreHidden();
    }
    getImageExtension() {
        this._assertInitialized();
        return this.markerClusterer.getImageExtension();
    }
    getImagePath() {
        this._assertInitialized();
        return this.markerClusterer.getImagePath();
    }
    getImageSizes() {
        this._assertInitialized();
        return this.markerClusterer.getImageSizes();
    }
    getMaxZoom() {
        this._assertInitialized();
        return this.markerClusterer.getMaxZoom();
    }
    getMinimumClusterSize() {
        this._assertInitialized();
        return this.markerClusterer.getMinimumClusterSize();
    }
    getStyles() {
        this._assertInitialized();
        return this.markerClusterer.getStyles();
    }
    getTitle() {
        this._assertInitialized();
        return this.markerClusterer.getTitle();
    }
    getTotalClusters() {
        this._assertInitialized();
        return this.markerClusterer.getTotalClusters();
    }
    getTotalMarkers() {
        this._assertInitialized();
        return this.markerClusterer.getTotalMarkers();
    }
    getZIndex() {
        this._assertInitialized();
        return this.markerClusterer.getZIndex();
    }
    getZoomOnClick() {
        this._assertInitialized();
        return this.markerClusterer.getZoomOnClick();
    }
    _combineOptions() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const options = this._options || DEFAULT_CLUSTERER_OPTIONS;
        return Object.assign(Object.assign({}, options), { ariaLabelFn: (_a = this.ariaLabelFn) !== null && _a !== void 0 ? _a : options.ariaLabelFn, averageCenter: (_b = this._averageCenter) !== null && _b !== void 0 ? _b : options.averageCenter, batchSize: (_c = this.batchSize) !== null && _c !== void 0 ? _c : options.batchSize, batchSizeIE: (_d = this._batchSizeIE) !== null && _d !== void 0 ? _d : options.batchSizeIE, calculator: (_e = this._calculator) !== null && _e !== void 0 ? _e : options.calculator, clusterClass: (_f = this._clusterClass) !== null && _f !== void 0 ? _f : options.clusterClass, enableRetinaIcons: (_g = this._enableRetinaIcons) !== null && _g !== void 0 ? _g : options.enableRetinaIcons, gridSize: (_h = this._gridSize) !== null && _h !== void 0 ? _h : options.gridSize, ignoreHidden: (_j = this._ignoreHidden) !== null && _j !== void 0 ? _j : options.ignoreHidden, imageExtension: (_k = this._imageExtension) !== null && _k !== void 0 ? _k : options.imageExtension, imagePath: (_l = this._imagePath) !== null && _l !== void 0 ? _l : options.imagePath, imageSizes: (_m = this._imageSizes) !== null && _m !== void 0 ? _m : options.imageSizes, maxZoom: (_o = this._maxZoom) !== null && _o !== void 0 ? _o : options.maxZoom, minimumClusterSize: (_p = this._minimumClusterSize) !== null && _p !== void 0 ? _p : options.minimumClusterSize, styles: (_q = this._styles) !== null && _q !== void 0 ? _q : options.styles, title: (_r = this._title) !== null && _r !== void 0 ? _r : options.title, zIndex: (_s = this._zIndex) !== null && _s !== void 0 ? _s : options.zIndex, zoomOnClick: (_t = this._zoomOnClick) !== null && _t !== void 0 ? _t : options.zoomOnClick });
    }
    _watchForMarkerChanges() {
        this._assertInitialized();
        const initialMarkers = [];
        for (const marker of this._getInternalMarkers(this._markers.toArray())) {
            this._currentMarkers.add(marker);
            initialMarkers.push(marker);
        }
        this.markerClusterer.addMarkers(initialMarkers);
        this._markers.changes.pipe(takeUntil(this._destroy)).subscribe((markerComponents) => {
            this._assertInitialized();
            const newMarkers = new Set(this._getInternalMarkers(markerComponents));
            const markersToAdd = [];
            const markersToRemove = [];
            for (const marker of Array.from(newMarkers)) {
                if (!this._currentMarkers.has(marker)) {
                    this._currentMarkers.add(marker);
                    markersToAdd.push(marker);
                }
            }
            for (const marker of Array.from(this._currentMarkers)) {
                if (!newMarkers.has(marker)) {
                    markersToRemove.push(marker);
                }
            }
            this.markerClusterer.addMarkers(markersToAdd, true);
            this.markerClusterer.removeMarkers(markersToRemove, true);
            this.markerClusterer.repaint();
            for (const marker of markersToRemove) {
                this._currentMarkers.delete(marker);
            }
        });
    }
    _getInternalMarkers(markers) {
        return markers.filter(markerComponent => !!markerComponent.marker)
            .map(markerComponent => markerComponent.marker);
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.markerClusterer) {
                throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' +
                    'Please wait for the MarkerClusterer to load before trying to interact with it.');
            }
        }
    }
}
MapMarkerClusterer.decorators = [
    { type: Component, args: [{
                selector: 'map-marker-clusterer',
                exportAs: 'mapMarkerClusterer',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: '<ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None
            },] }
];
MapMarkerClusterer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapMarkerClusterer.propDecorators = {
    ariaLabelFn: [{ type: Input }],
    averageCenter: [{ type: Input }],
    batchSize: [{ type: Input }],
    batchSizeIE: [{ type: Input }],
    calculator: [{ type: Input }],
    clusterClass: [{ type: Input }],
    enableRetinaIcons: [{ type: Input }],
    gridSize: [{ type: Input }],
    ignoreHidden: [{ type: Input }],
    imageExtension: [{ type: Input }],
    imagePath: [{ type: Input }],
    imageSizes: [{ type: Input }],
    maxZoom: [{ type: Input }],
    minimumClusterSize: [{ type: Input }],
    styles: [{ type: Input }],
    title: [{ type: Input }],
    zIndex: [{ type: Input }],
    zoomOnClick: [{ type: Input }],
    options: [{ type: Input }],
    clusteringbegin: [{ type: Output }],
    clusteringend: [{ type: Output }],
    _markers: [{ type: ContentChildren, args: [MapMarker, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUNwQyxrREFBa0Q7QUFFbEQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRW5ELHVDQUF1QztBQUN2QyxNQUFNLHlCQUF5QixHQUEyQixFQUFFLENBQUM7QUFFN0Q7Ozs7R0FJRztBQVFILE1BQU0sT0FBTyxrQkFBa0I7SUE2STdCLFlBQTZCLFVBQXFCLEVBQW1CLE9BQWU7UUFBdkQsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBNUluRSxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1FBQ2hELGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBTWhELGdCQUFXLEdBQWdCLEdBQUcsRUFBRSxDQUFD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LENBQUMsZUFBZSxFQUFFO2dCQUN6QixNQUFNLEtBQUssQ0FDVCx5RUFBeUU7b0JBQ3pFLGdGQUFnRixDQUFDLENBQUM7YUFDckY7U0FDRjtJQUNILENBQUM7OztZQXphRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7WUFsQk8sU0FBUztZQVpmLE1BQU07OzswQkF1Q0wsS0FBSzs0QkFHTCxLQUFLO3dCQU1MLEtBQUs7MEJBRUwsS0FBSzt5QkFNTCxLQUFLOzJCQU1MLEtBQUs7Z0NBTUwsS0FBSzt1QkFNTCxLQUFLOzJCQU1MLEtBQUs7NkJBTUwsS0FBSzt3QkFNTCxLQUFLO3lCQU1MLEtBQUs7c0JBTUwsS0FBSztpQ0FNTCxLQUFLO3FCQU1MLEtBQUs7b0JBTUwsS0FBSztxQkFNTCxLQUFLOzBCQU1MLEtBQUs7c0JBTUwsS0FBSzs4QkFXTCxNQUFNOzRCQU9OLE1BQU07dUJBR04sZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJtYXJrZXItY2x1c3RlcmVyLXR5cGVzLnRzXCIgLz5cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4uL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5cbi8qKiBEZWZhdWx0IG9wdGlvbnMgZm9yIGEgY2x1c3RlcmVyLiAqL1xuY29uc3QgREVGQVVMVF9DTFVTVEVSRVJfT1BUSU9OUzogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyA9IHt9O1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IGZvciBpbXBsZW1lbnRpbmcgYSBHb29nbGUgTWFwcyBNYXJrZXIgQ2x1c3RlcmVyLlxuICpcbiAqIFNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9tYXJrZXItY2x1c3RlcmluZ1xuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXAtbWFya2VyLWNsdXN0ZXJlcicsXG4gIGV4cG9ydEFzOiAnbWFwTWFya2VyQ2x1c3RlcmVyJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hcE1hcmtlckNsdXN0ZXJlciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9jdXJyZW50TWFya2VycyA9IG5ldyBTZXQ8Z29vZ2xlLm1hcHMuTWFya2VyPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbHVzdGVyZXIgaXMgYWxsb3dlZCB0byBiZSBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY2FuSW5pdGlhbGl6ZTogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBhcmlhTGFiZWxGbjogQXJpYUxhYmVsRm4gPSAoKSA9PiAnJ1xuXG4gIEBJbnB1dCgpXG4gIHNldCBhdmVyYWdlQ2VudGVyKGF2ZXJhZ2VDZW50ZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hdmVyYWdlQ2VudGVyID0gYXZlcmFnZUNlbnRlcjtcbiAgfVxuICBwcml2YXRlIF9hdmVyYWdlQ2VudGVyOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIGJhdGNoU2l6ZT86IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgYmF0Y2hTaXplSUUoYmF0Y2hTaXplSUU6IG51bWJlcikge1xuICAgIHRoaXMuX2JhdGNoU2l6ZUlFID0gYmF0Y2hTaXplSUU7XG4gIH1cbiAgcHJpdmF0ZSBfYmF0Y2hTaXplSUU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgY2FsY3VsYXRvcihjYWxjdWxhdG9yOiBDYWxjdWxhdG9yKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRvciA9IGNhbGN1bGF0b3I7XG4gIH1cbiAgcHJpdmF0ZSBfY2FsY3VsYXRvcjogQ2FsY3VsYXRvcjtcblxuICBASW5wdXQoKVxuICBzZXQgY2x1c3RlckNsYXNzKGNsdXN0ZXJDbGFzczogc3RyaW5nKSB7XG4gICAgdGhpcy5fY2x1c3RlckNsYXNzID0gY2x1c3RlckNsYXNzO1xuICB9XG4gIHByaXZhdGUgX2NsdXN0ZXJDbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBlbmFibGVSZXRpbmFJY29ucyhlbmFibGVSZXRpbmFJY29uczogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZVJldGluYUljb25zID0gZW5hYmxlUmV0aW5hSWNvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IGdyaWRTaXplKGdyaWRTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IGdyaWRTaXplO1xuICB9XG4gIHByaXZhdGUgX2dyaWRTaXplOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGlnbm9yZUhpZGRlbihpZ25vcmVIaWRkZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pZ25vcmVIaWRkZW4gPSBpZ25vcmVIaWRkZW47XG4gIH1cbiAgcHJpdmF0ZSBfaWdub3JlSGlkZGVuOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZUV4dGVuc2lvbihpbWFnZUV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5faW1hZ2VFeHRlbnNpb24gPSBpbWFnZUV4dGVuc2lvbjtcbiAgfVxuICBwcml2YXRlIF9pbWFnZUV4dGVuc2lvbjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZVBhdGgoaW1hZ2VQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pbWFnZVBhdGggPSBpbWFnZVBhdGg7XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VQYXRoOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlU2l6ZXMoaW1hZ2VTaXplczogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9pbWFnZVNpemVzID0gaW1hZ2VTaXplcztcbiAgfVxuICBwcml2YXRlIF9pbWFnZVNpemVzOiBudW1iZXJbXTtcblxuICBASW5wdXQoKVxuICBzZXQgbWF4Wm9vbShtYXhab29tOiBudW1iZXIpIHtcbiAgICB0aGlzLl9tYXhab29tID0gbWF4Wm9vbTtcbiAgfVxuICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IG1pbmltdW1DbHVzdGVyU2l6ZShtaW5pbXVtQ2x1c3RlclNpemU6IG51bWJlcikge1xuICAgIHRoaXMuX21pbmltdW1DbHVzdGVyU2l6ZSA9IG1pbmltdW1DbHVzdGVyU2l6ZTtcbiAgfVxuICBwcml2YXRlIF9taW5pbXVtQ2x1c3RlclNpemU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgc3R5bGVzKHN0eWxlczogQ2x1c3Rlckljb25TdHlsZVtdKSB7XG4gICAgdGhpcy5fc3R5bGVzID0gc3R5bGVzO1xuICB9XG4gIHByaXZhdGUgX3N0eWxlczogQ2x1c3Rlckljb25TdHlsZVtdO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcbiAgfVxuICBwcml2YXRlIF90aXRsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB6SW5kZXgoekluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLl96SW5kZXggPSB6SW5kZXg7XG4gIH1cbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IHpvb21PbkNsaWNrKHpvb21PbkNsaWNrOiBib29sZWFuKSB7XG4gICAgdGhpcy5fem9vbU9uQ2xpY2sgPSB6b29tT25DbGljaztcbiAgfVxuICBwcml2YXRlIF96b29tT25DbGljazogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucztcblxuICAvKipcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9tb2R1bGVzL1xuICAgKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nYmVnaW5cbiAgICovXG4gIEBPdXRwdXQoKVxuICBjbHVzdGVyaW5nYmVnaW46IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsdXN0ZXJpbmdiZWdpbicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L21vZHVsZXMvX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmh0bWwjY2x1c3RlcmluZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNsdXN0ZXJpbmdlbmQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsdXN0ZXJpbmdlbmQnKTtcblxuICBAQ29udGVudENoaWxkcmVuKE1hcE1hcmtlciwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX21hcmtlcnM6IFF1ZXJ5TGlzdDxNYXBNYXJrZXI+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBNYXJrZXJDbHVzdGVyZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWVcbiAgICogZ29vZ2xlbWFwcy5naXRodWIuaW8vdjMtdXRpbGl0eS1saWJyYXJ5L2NsYXNzZXMvXG4gICAqIF9nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5tYXJrZXJjbHVzdGVyZXIuaHRtbFxuICAgKi9cbiAgbWFya2VyQ2x1c3RlcmVyPzogTWFya2VyQ2x1c3RlcmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLCBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2NhbkluaXRpYWxpemUgPSB0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3NlcjtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlciA9IG5ldyBNYXJrZXJDbHVzdGVyZXIodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEsIFtdLFxuICAgICAgICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXJDbHVzdGVyZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fY2FuSW5pdGlhbGl6ZSkge1xuICAgICAgdGhpcy5fd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHtcbiAgICAgIG1hcmtlckNsdXN0ZXJlcjogY2x1c3RlcmVyLCBhcmlhTGFiZWxGbiwgX2F2ZXJhZ2VDZW50ZXIsIF9iYXRjaFNpemVJRSwgX2NhbGN1bGF0b3IsIF9zdHlsZXMsXG4gICAgICBfY2x1c3RlckNsYXNzLCBfZW5hYmxlUmV0aW5hSWNvbnMsIF9ncmlkU2l6ZSwgX2lnbm9yZUhpZGRlbiwgX2ltYWdlRXh0ZW5zaW9uLCBfaW1hZ2VQYXRoLFxuICAgICAgX2ltYWdlU2l6ZXMsIF9tYXhab29tLCBfbWluaW11bUNsdXN0ZXJTaXplLCBfdGl0bGUsIF96SW5kZXgsIF96b29tT25DbGlja1xuICAgIH0gPSB0aGlzO1xuXG4gICAgaWYgKGNsdXN0ZXJlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydhcmlhTGFiZWxGbiddKSB7XG4gICAgICAgIGNsdXN0ZXJlci5hcmlhTGFiZWxGbiA9IGFyaWFMYWJlbEZuO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2F2ZXJhZ2VDZW50ZXInXSAmJiBfYXZlcmFnZUNlbnRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRBdmVyYWdlQ2VudGVyKF9hdmVyYWdlQ2VudGVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydiYXRjaFNpemVJRSddICYmIF9iYXRjaFNpemVJRSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRCYXRjaFNpemVJRShfYmF0Y2hTaXplSUUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2NhbGN1bGF0b3InXSAmJiBfY2FsY3VsYXRvcikge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Q2FsY3VsYXRvcihfY2FsY3VsYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snY2x1c3RlckNsYXNzJ10gJiYgX2NsdXN0ZXJDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRDbHVzdGVyQ2xhc3MoX2NsdXN0ZXJDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snZW5hYmxlUmV0aW5hSWNvbnMnXSAmJiBfZW5hYmxlUmV0aW5hSWNvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0RW5hYmxlUmV0aW5hSWNvbnMoX2VuYWJsZVJldGluYUljb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydncmlkU2l6ZSddICYmIF9ncmlkU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRHcmlkU2l6ZShfZ3JpZFNpemUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2lnbm9yZUhpZGRlbiddICYmIF9pZ25vcmVIaWRkZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SWdub3JlSGlkZGVuKF9pZ25vcmVIaWRkZW4pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlRXh0ZW5zaW9uJ10gJiYgX2ltYWdlRXh0ZW5zaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlRXh0ZW5zaW9uKF9pbWFnZUV4dGVuc2lvbik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VQYXRoJ10gJiYgX2ltYWdlUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZVBhdGgoX2ltYWdlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VTaXplcyddICYmIF9pbWFnZVNpemVzKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZVNpemVzKF9pbWFnZVNpemVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydtYXhab29tJ10gJiYgX21heFpvb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0TWF4Wm9vbShfbWF4Wm9vbSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snbWluaW11bUNsdXN0ZXJTaXplJ10gJiYgX21pbmltdW1DbHVzdGVyU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRNaW5pbXVtQ2x1c3RlclNpemUoX21pbmltdW1DbHVzdGVyU2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snc3R5bGVzJ10gJiYgX3N0eWxlcykge1xuICAgICAgICBjbHVzdGVyZXIuc2V0U3R5bGVzKF9zdHlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10gJiYgX3RpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFRpdGxlKF90aXRsZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snekluZGV4J10gJiYgX3pJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRaSW5kZXgoX3pJbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snem9vbU9uQ2xpY2snXSAmJiBfem9vbU9uQ2xpY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Wm9vbU9uQ2xpY2soX3pvb21PbkNsaWNrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICBmaXRNYXBUb01hcmtlcnMocGFkZGluZzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmZpdE1hcFRvTWFya2VycyhwYWRkaW5nKTtcbiAgfVxuXG4gIGdldEF2ZXJhZ2VDZW50ZXIoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QXZlcmFnZUNlbnRlcigpO1xuICB9XG5cbiAgZ2V0QmF0Y2hTaXplSUUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRCYXRjaFNpemVJRSgpO1xuICB9XG5cbiAgZ2V0Q2FsY3VsYXRvcigpOiBDYWxjdWxhdG9yIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDYWxjdWxhdG9yKCk7XG4gIH1cblxuICBnZXRDbHVzdGVyQ2xhc3MoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDbHVzdGVyQ2xhc3MoKTtcbiAgfVxuXG4gIGdldENsdXN0ZXJzKCk6IENsdXN0ZXJbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldEVuYWJsZVJldGluYUljb25zKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEVuYWJsZVJldGluYUljb25zKCk7XG4gIH1cblxuICBnZXRHcmlkU2l6ZSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEdyaWRTaXplKCk7XG4gIH1cblxuICBnZXRJZ25vcmVIaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SWdub3JlSGlkZGVuKCk7XG4gIH1cblxuICBnZXRJbWFnZUV4dGVuc2lvbigpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlRXh0ZW5zaW9uKCk7XG4gIH1cblxuICBnZXRJbWFnZVBhdGgoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVBhdGgoKTtcbiAgfVxuXG4gIGdldEltYWdlU2l6ZXMoKTogbnVtYmVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlU2l6ZXMoKTtcbiAgfVxuXG4gIGdldE1heFpvb20oKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNYXhab29tKCk7XG4gIH1cblxuICBnZXRNaW5pbXVtQ2x1c3RlclNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNaW5pbXVtQ2x1c3RlclNpemUoKTtcbiAgfVxuXG4gIGdldFN0eWxlcygpOiBDbHVzdGVySWNvblN0eWxlW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFN0eWxlcygpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUaXRsZSgpO1xuICB9XG5cbiAgZ2V0VG90YWxDbHVzdGVycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsQ2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldFRvdGFsTWFya2VycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsTWFya2VycygpO1xuICB9XG5cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0WkluZGV4KCk7XG4gIH1cblxuICBnZXRab29tT25DbGljaygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRab29tT25DbGljaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgREVGQVVMVF9DTFVTVEVSRVJfT1BUSU9OUztcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGFyaWFMYWJlbEZuOiB0aGlzLmFyaWFMYWJlbEZuID8/IG9wdGlvbnMuYXJpYUxhYmVsRm4sXG4gICAgICBhdmVyYWdlQ2VudGVyOiB0aGlzLl9hdmVyYWdlQ2VudGVyID8/IG9wdGlvbnMuYXZlcmFnZUNlbnRlcixcbiAgICAgIGJhdGNoU2l6ZTogdGhpcy5iYXRjaFNpemUgPz8gb3B0aW9ucy5iYXRjaFNpemUsXG4gICAgICBiYXRjaFNpemVJRTogdGhpcy5fYmF0Y2hTaXplSUUgPz8gb3B0aW9ucy5iYXRjaFNpemVJRSxcbiAgICAgIGNhbGN1bGF0b3I6IHRoaXMuX2NhbGN1bGF0b3IgPz8gb3B0aW9ucy5jYWxjdWxhdG9yLFxuICAgICAgY2x1c3RlckNsYXNzOiB0aGlzLl9jbHVzdGVyQ2xhc3MgPz8gb3B0aW9ucy5jbHVzdGVyQ2xhc3MsXG4gICAgICBlbmFibGVSZXRpbmFJY29uczogdGhpcy5fZW5hYmxlUmV0aW5hSWNvbnMgPz8gb3B0aW9ucy5lbmFibGVSZXRpbmFJY29ucyxcbiAgICAgIGdyaWRTaXplOiB0aGlzLl9ncmlkU2l6ZSA/PyBvcHRpb25zLmdyaWRTaXplLFxuICAgICAgaWdub3JlSGlkZGVuOiB0aGlzLl9pZ25vcmVIaWRkZW4gPz8gb3B0aW9ucy5pZ25vcmVIaWRkZW4sXG4gICAgICBpbWFnZUV4dGVuc2lvbjogdGhpcy5faW1hZ2VFeHRlbnNpb24gPz8gb3B0aW9ucy5pbWFnZUV4dGVuc2lvbixcbiAgICAgIGltYWdlUGF0aDogdGhpcy5faW1hZ2VQYXRoID8/IG9wdGlvbnMuaW1hZ2VQYXRoLFxuICAgICAgaW1hZ2VTaXplczogdGhpcy5faW1hZ2VTaXplcyA/PyBvcHRpb25zLmltYWdlU2l6ZXMsXG4gICAgICBtYXhab29tOiB0aGlzLl9tYXhab29tID8/IG9wdGlvbnMubWF4Wm9vbSxcbiAgICAgIG1pbmltdW1DbHVzdGVyU2l6ZTogdGhpcy5fbWluaW11bUNsdXN0ZXJTaXplID8/IG9wdGlvbnMubWluaW11bUNsdXN0ZXJTaXplLFxuICAgICAgc3R5bGVzOiB0aGlzLl9zdHlsZXMgPz8gb3B0aW9ucy5zdHlsZXMsXG4gICAgICB0aXRsZTogdGhpcy5fdGl0bGUgPz8gb3B0aW9ucy50aXRsZSxcbiAgICAgIHpJbmRleDogdGhpcy5fekluZGV4ID8/IG9wdGlvbnMuekluZGV4LFxuICAgICAgem9vbU9uQ2xpY2s6IHRoaXMuX3pvb21PbkNsaWNrID8/IG9wdGlvbnMuem9vbU9uQ2xpY2ssXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIGNvbnN0IGluaXRpYWxNYXJrZXJzOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMuX2dldEludGVybmFsTWFya2Vycyh0aGlzLl9tYXJrZXJzLnRvQXJyYXkoKSkpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmFkZChtYXJrZXIpO1xuICAgICAgaW5pdGlhbE1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgIH1cbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKGluaXRpYWxNYXJrZXJzKTtcblxuICAgIHRoaXMuX21hcmtlcnMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKFxuICAgICAgKG1hcmtlckNvbXBvbmVudHM6IE1hcE1hcmtlcltdKSA9PiB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIGNvbnN0IG5ld01hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4odGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlckNvbXBvbmVudHMpKTtcbiAgICAgICAgY29uc3QgbWFya2Vyc1RvQWRkOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCBtYXJrZXJzVG9SZW1vdmU6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20obmV3TWFya2VycykpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlcnNUb0FkZC5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20odGhpcy5fY3VycmVudE1hcmtlcnMpKSB7XG4gICAgICAgICAgaWYgKCFuZXdNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICBtYXJrZXJzVG9SZW1vdmUucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKG1hcmtlcnNUb0FkZCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlbW92ZU1hcmtlcnMobWFya2Vyc1RvUmVtb3ZlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVwYWludCgpO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBtYXJrZXJzVG9SZW1vdmUpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5kZWxldGUobWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlcnM6IE1hcE1hcmtlcltdKTogZ29vZ2xlLm1hcHMuTWFya2VyW10ge1xuICAgIHJldHVybiBtYXJrZXJzLmZpbHRlcihtYXJrZXJDb21wb25lbnQgPT4gISFtYXJrZXJDb21wb25lbnQubWFya2VyKVxuICAgICAgICAubWFwKG1hcmtlckNvbXBvbmVudCA9PiBtYXJrZXJDb21wb25lbnQubWFya2VyISk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlckNsdXN0ZXJlcjogTWFya2VyQ2x1c3RlcmVyfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgTWFya2VyQ2x1c3RlcmVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyQ2x1c3RlcmVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19