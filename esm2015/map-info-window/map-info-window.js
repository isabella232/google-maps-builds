/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-info-window/map-info-window.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="googlemaps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Directive, ElementRef, Input, Output, NgZone, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/info-window
 */
export class MapInfoWindow {
    /**
     * @param {?} _googleMap
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    constructor(_googleMap, _elementRef, _ngZone) {
        this._googleMap = _googleMap;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject({});
        this._position = new BehaviorSubject(undefined);
        this._destroy = new Subject();
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
         */
        this.closeclick = this._eventManager.getLazyEmitter('closeclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.content_changed
         */
        this.contentChanged = this._eventManager.getLazyEmitter('content_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
         */
        this.domready = this._eventManager.getLazyEmitter('domready');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.position_changed
         */
        this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.zindex_changed
         */
        this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this._options.next(options || {});
    }
    /**
     * @param {?} position
     * @return {?}
     */
    set position(position) {
        this._position.next(position);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            this._combineOptions().pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                if (this._infoWindow) {
                    this._infoWindow.setOptions(options);
                }
                else {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this._infoWindow = new google.maps.InfoWindow(options);
                    }));
                    this._eventManager.setTarget(this._infoWindow);
                }
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroy.next();
        this._destroy.complete();
        // If no info window has been created on the server, we do not try closing it.
        // On the server, an info window cannot be created and this would cause errors.
        if (this._infoWindow) {
            this.close();
        }
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     * @return {?}
     */
    close() {
        if (this._infoWindow) {
            this._infoWindow.close();
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     * @return {?}
     */
    getContent() {
        return this._infoWindow ? this._infoWindow.getContent() : '';
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     * @return {?}
     */
    getPosition() {
        return this._infoWindow ? this._infoWindow.getPosition() : null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     * @return {?}
     */
    getZIndex() {
        return this._infoWindow ? this._infoWindow.getZIndex() : -1;
    }
    /**
     * Opens the MapInfoWindow using the provided MapMarker as the anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     * @param {?=} anchor
     * @return {?}
     */
    open(anchor) {
        /** @type {?} */
        const marker = anchor ? anchor._marker : undefined;
        if (this._googleMap._googleMap && this._infoWindow) {
            this._elementRef.nativeElement.style.display = '';
            (/** @type {?} */ (this._infoWindow)).open(this._googleMap._googleMap, marker);
        }
    }
    /**
     * @private
     * @return {?}
     */
    _combineOptions() {
        return combineLatest([this._options, this._position]).pipe(map((/**
         * @param {?} __0
         * @return {?}
         */
        ([options, position]) => {
            /** @type {?} */
            const combinedOptions = Object.assign(Object.assign({}, options), { position: position || options.position, content: this._elementRef.nativeElement });
            return combinedOptions;
        })));
    }
}
MapInfoWindow.decorators = [
    { type: Directive, args: [{
                selector: 'map-info-window',
                host: { 'style': 'display: none' },
            },] }
];
/** @nocollapse */
MapInfoWindow.ctorParameters = () => [
    { type: GoogleMap },
    { type: ElementRef },
    { type: NgZone }
];
MapInfoWindow.propDecorators = {
    options: [{ type: Input }],
    position: [{ type: Input }],
    closeclick: [{ type: Output }],
    contentChanged: [{ type: Output }],
    domready: [{ type: Output }],
    positionChanged: [{ type: Output }],
    zindexChanged: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._destroy;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._infoWindow;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
     * @type {?}
     */
    MapInfoWindow.prototype.closeclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.content_changed
     * @type {?}
     */
    MapInfoWindow.prototype.contentChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
     * @type {?}
     */
    MapInfoWindow.prototype.domready;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.position_changed
     * @type {?}
     */
    MapInfoWindow.prototype.positionChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.zindex_changed
     * @type {?}
     */
    MapInfoWindow.prototype.zindexChanged;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._googleMap;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWluZm8td2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFDTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUVuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBVXJELE1BQU0sT0FBTyxhQUFhOzs7Ozs7SUFzRHhCLFlBQTZCLFVBQXFCLEVBQzlCLFdBQW9DLEVBQ3BDLE9BQWU7UUFGTixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBdkQzQixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQWdDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLGNBQVMsR0FDdEIsSUFBSSxlQUFlLENBQXlELFNBQVMsQ0FBQyxDQUFDO1FBQzFFLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7OztRQWlCdEMsZUFBVSxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxZQUFZLENBQUMsQ0FBQzs7Ozs7O1FBUS9GLG1C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O0lBTy9GLHVDQUM4Rjs7Ozs7O0lBTTlGLGlDQUEyRjs7Ozs7OztJQU8zRix3Q0FDZ0c7Ozs7Ozs7SUFPaEcsc0NBQzRGOzs7OztJQUVoRixtQ0FBc0M7Ozs7O0lBQ3RDLG9DQUE0Qzs7Ozs7SUFDNUMsZ0NBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4uL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIGluZm8gd2luZG93IHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWluZm8td2luZG93JyxcbiAgaG9zdDogeydzdHlsZSc6ICdkaXNwbGF5OiBub25lJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hcEluZm9XaW5kb3cgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcG9zaXRpb24gPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9pbmZvV2luZG93PzogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdztcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5JbmZvV2luZG93T3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IHt9KTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmcpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5uZXh0KHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmNsb3NlY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSBjbG9zZWNsaWNrOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbG9zZWNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LmNvbnRlbnRfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNvbnRlbnRDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjb250ZW50X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5kb21yZWFkeVxuICAgKi9cbiAgQE91dHB1dCgpIGRvbXJlYWR5OiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkb21yZWFkeScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy5wb3NpdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9zaXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdwb3NpdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LnppbmRleF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgemluZGV4Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignemluZGV4X2NoYW5nZWQnKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICBpZiAodGhpcy5faW5mb1dpbmRvdykge1xuICAgICAgICAgIHRoaXMuX2luZm9XaW5kb3cuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5faW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KG9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLl9pbmZvV2luZG93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG5cbiAgICAvLyBJZiBubyBpbmZvIHdpbmRvdyBoYXMgYmVlbiBjcmVhdGVkIG9uIHRoZSBzZXJ2ZXIsIHdlIGRvIG5vdCB0cnkgY2xvc2luZyBpdC5cbiAgICAvLyBPbiB0aGUgc2VydmVyLCBhbiBpbmZvIHdpbmRvdyBjYW5ub3QgYmUgY3JlYXRlZCBhbmQgdGhpcyB3b3VsZCBjYXVzZSBlcnJvcnMuXG4gICAgaWYgKHRoaXMuX2luZm9XaW5kb3cpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5jbG9zZVxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgaWYgKHRoaXMuX2luZm9XaW5kb3cpIHtcbiAgICAgIHRoaXMuX2luZm9XaW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5nZXRDb250ZW50XG4gICAqL1xuICBnZXRDb250ZW50KCk6IHN0cmluZ3xOb2RlIHtcbiAgICByZXR1cm4gdGhpcy5faW5mb1dpbmRvdyA/IHRoaXMuX2luZm9XaW5kb3cuZ2V0Q29udGVudCgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAgICogI0luZm9XaW5kb3cuZ2V0UG9zaXRpb25cbiAgICovXG4gIGdldFBvc2l0aW9uKCk6IGdvb2dsZS5tYXBzLkxhdExuZ3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5faW5mb1dpbmRvdyA/IHRoaXMuX2luZm9XaW5kb3cuZ2V0UG9zaXRpb24oKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5nZXRaSW5kZXhcbiAgICovXG4gIGdldFpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pbmZvV2luZG93ID8gdGhpcy5faW5mb1dpbmRvdy5nZXRaSW5kZXgoKSA6IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBNYXBJbmZvV2luZG93IHVzaW5nIHRoZSBwcm92aWRlZCBNYXBNYXJrZXIgYXMgdGhlIGFuY2hvci4gSWYgdGhlIGFuY2hvciBpcyBub3Qgc2V0LFxuICAgKiB0aGVuIHRoZSBwb3NpdGlvbiBwcm9wZXJ0eSBvZiB0aGUgb3B0aW9ucyBpbnB1dCBpcyB1c2VkIGluc3RlYWQuXG4gICAqL1xuICBvcGVuKGFuY2hvcj86IE1hcE1hcmtlcikge1xuICAgIGNvbnN0IG1hcmtlciA9IGFuY2hvciA/IGFuY2hvci5fbWFya2VyIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2dvb2dsZU1hcCAmJiB0aGlzLl9pbmZvV2luZG93KSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgdGhpcy5faW5mb1dpbmRvdyEub3Blbih0aGlzLl9nb29nbGVNYXAuX2dvb2dsZU1hcCwgbWFya2VyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkluZm9XaW5kb3dPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3Bvc2l0aW9uXSkucGlwZShtYXAoKFtvcHRpb25zLCBwb3NpdGlvbl0pID0+IHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbiB8fCBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgICBjb250ZW50OiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICB9KSk7XG4gIH1cbn1cbiJdfQ==