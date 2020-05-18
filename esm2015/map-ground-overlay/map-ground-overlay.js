/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-ground-overlay/map-ground-overlay.ts
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
import { Directive, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
let MapGroundOverlay = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     */
    class MapGroundOverlay {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._opacity = new BehaviorSubject(1);
            this._url = new BehaviorSubject('');
            this._destroyed = new Subject();
            /**
             * Whether the overlay is clickable
             */
            this.clickable = false;
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
             */
            this.mapClick = this._eventManager.getLazyEmitter('click');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/image-overlay
             * #GroundOverlay.dblclick
             */
            this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        }
        /**
         * URL of the image that will be shown in the overlay.
         * @param {?} url
         * @return {?}
         */
        set url(url) {
            this._url.next(url);
        }
        /**
         * Opacity of the overlay.
         * @param {?} opacity
         * @return {?}
         */
        set opacity(opacity) {
            this._opacity.next(opacity);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (!this.bounds) {
                throw Error('Image bounds are required');
            }
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.groundOverlay =
                            new google.maps.GroundOverlay(this._url.getValue(), this.bounds, options);
                    }));
                    this._assertInitialized();
                    this.groundOverlay.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.groundOverlay);
                }));
                this._watchForOpacityChanges();
                this._watchForUrlChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.groundOverlay) {
                this.groundOverlay.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getBounds
         * @return {?}
         */
        getBounds() {
            this._assertInitialized();
            return this.groundOverlay.getBounds();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getOpacity
         * @return {?}
         */
        getOpacity() {
            this._assertInitialized();
            return this.groundOverlay.getOpacity();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getUrl
         * @return {?}
         */
        getUrl() {
            this._assertInitialized();
            return this.groundOverlay.getUrl();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return this._opacity.pipe(map((/**
             * @param {?} opacity
             * @return {?}
             */
            opacity => {
                /** @type {?} */
                const combinedOptions = {
                    clickable: this.clickable,
                    opacity,
                };
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOpacityChanges() {
            this._opacity.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} opacity
             * @return {?}
             */
            opacity => {
                if (opacity) {
                    this._assertInitialized();
                    this.groundOverlay.setOpacity(opacity);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForUrlChanges() {
            this._url.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} url
             * @return {?}
             */
            url => {
                this._assertInitialized();
                /** @type {?} */
                const overlay = this.groundOverlay;
                overlay.set('url', url);
                // Google Maps only redraws the overlay if we re-set the map.
                overlay.setMap(null);
                overlay.setMap((/** @type {?} */ (this._map.googleMap)));
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.groundOverlay) {
                throw Error('Cannot interact with a Google Map GroundOverlay before it has been initialized. ' +
                    'Please wait for the GroundOverlay to load before trying to interact with it.');
            }
        }
    }
    MapGroundOverlay.decorators = [
        { type: Directive, args: [{
                    selector: 'map-ground-overlay',
                },] }
    ];
    /** @nocollapse */
    MapGroundOverlay.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapGroundOverlay.propDecorators = {
        url: [{ type: Input }],
        bounds: [{ type: Input }],
        clickable: [{ type: Input }],
        opacity: [{ type: Input }],
        mapClick: [{ type: Output }],
        mapDblclick: [{ type: Output }]
    };
    return MapGroundOverlay;
})();
export { MapGroundOverlay };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._opacity;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._url;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._destroyed;
    /**
     * The underlying google.maps.GroundOverlay object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     * @type {?}
     */
    MapGroundOverlay.prototype.groundOverlay;
    /**
     * Bounds for the overlay.
     * @type {?}
     */
    MapGroundOverlay.prototype.bounds;
    /**
     * Whether the overlay is clickable
     * @type {?}
     */
    MapGroundOverlay.prototype.clickable;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
     * @type {?}
     */
    MapGroundOverlay.prototype.mapClick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.dblclick
     * @type {?}
     */
    MapGroundOverlay.prototype.mapDblclick;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7Ozs7OztBQU9yRDs7Ozs7O0lBQUEsTUFHYSxnQkFBZ0I7Ozs7O1FBaUQzQixZQUE2QixJQUFlLEVBQW1CLE9BQWU7WUFBakQsU0FBSSxHQUFKLElBQUksQ0FBVztZQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1lBaER0RSxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQVMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsU0FBSSxHQUFHLElBQUksZUFBZSxDQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7O1lBbUJ6QyxjQUFTLEdBQVksS0FBSyxDQUFDOzs7OztZQWFwQyxhQUFRLEdBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXlCLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7WUFRdkUsZ0JBQVcsR0FD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QkFDL0I7Ozs7Z0JBVk8sU0FBUztnQkFKUyxNQUFNOzs7c0JBOEI3QixLQUFLO3lCQU1MLEtBQUs7NEJBR0wsS0FBSzswQkFHTCxLQUFLOzJCQVNMLE1BQU07OEJBU04sTUFBTTs7SUErR1QsdUJBQUM7S0FBQTtTQTVKWSxnQkFBZ0I7Ozs7OztJQUMzQix5Q0FBMEQ7Ozs7O0lBRTFELG9DQUEyRDs7Ozs7SUFDM0QsZ0NBQXdEOzs7OztJQUN4RCxzQ0FBa0Q7Ozs7Ozs7SUFPbEQseUNBQTBDOzs7OztJQVMxQyxrQ0FBMEU7Ozs7O0lBRzFFLHFDQUFvQzs7Ozs7O0lBWXBDLG9DQUV1RTs7Ozs7OztJQU92RSx1Q0FFMEU7Ozs7O0lBRTlELGdDQUFnQzs7Ozs7SUFBRSxtQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgR3JvdW5kIE92ZXJsYXkgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWdyb3VuZC1vdmVybGF5Jyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwR3JvdW5kT3ZlcmxheSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX29wYWNpdHkgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4oMSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3VybCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPignJyk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXkgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXlcbiAgICovXG4gIGdyb3VuZE92ZXJsYXk/OiBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5O1xuXG4gIC8qKiBVUkwgb2YgdGhlIGltYWdlIHRoYXQgd2lsbCBiZSBzaG93biBpbiB0aGUgb3ZlcmxheS4gKi9cbiAgQElucHV0KClcbiAgc2V0IHVybCh1cmw6IHN0cmluZykge1xuICAgIHRoaXMuX3VybC5uZXh0KHVybCk7XG4gIH1cblxuICAvKiogQm91bmRzIGZvciB0aGUgb3ZlcmxheS4gKi9cbiAgQElucHV0KCkgYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbDtcblxuICAvKiogV2hldGhlciB0aGUgb3ZlcmxheSBpcyBjbGlja2FibGUgKi9cbiAgQElucHV0KCkgY2xpY2thYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE9wYWNpdHkgb2YgdGhlIG92ZXJsYXkuICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcGFjaXR5KG9wYWNpdHk6IG51bWJlcikge1xuICAgIHRoaXMuX29wYWNpdHkubmV4dChvcGFjaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXkuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5ib3VuZHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdJbWFnZSBib3VuZHMgYXJlIHJlcXVpcmVkJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkgPVxuICAgICAgICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheSh0aGlzLl91cmwuZ2V0VmFsdWUoKSwgdGhpcy5ib3VuZHMsIG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5ncm91bmRPdmVybGF5LnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5ncm91bmRPdmVybGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wYWNpdHlDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclVybENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgaWYgKHRoaXMuZ3JvdW5kT3ZlcmxheSkge1xuICAgICAgdGhpcy5ncm91bmRPdmVybGF5LnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5nZXRCb3VuZHNcbiAgICovXG4gIGdldEJvdW5kcygpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldE9wYWNpdHlcbiAgICovXG4gIGdldE9wYWNpdHkoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0T3BhY2l0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0VXJsXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0VXJsKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXlPcHRpb25zPiB7XG4gICAgcmV0dXJuIHRoaXMuX29wYWNpdHkucGlwZShtYXAob3BhY2l0eSA9PiB7XG4gICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXlPcHRpb25zID0ge1xuICAgICAgICBjbGlja2FibGU6IHRoaXMuY2xpY2thYmxlLFxuICAgICAgICBvcGFjaXR5LFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcGFjaXR5Q2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcGFjaXR5LnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcGFjaXR5ID0+IHtcbiAgICAgIGlmIChvcGFjaXR5KSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheS5zZXRPcGFjaXR5KG9wYWNpdHkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JVcmxDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3VybC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUodXJsID0+IHtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICBjb25zdCBvdmVybGF5ID0gdGhpcy5ncm91bmRPdmVybGF5O1xuICAgICAgb3ZlcmxheS5zZXQoJ3VybCcsIHVybCk7XG5cbiAgICAgIC8vIEdvb2dsZSBNYXBzIG9ubHkgcmVkcmF3cyB0aGUgb3ZlcmxheSBpZiB3ZSByZS1zZXQgdGhlIG1hcC5cbiAgICAgIG92ZXJsYXkuc2V0TWFwKG51bGwpO1xuICAgICAgb3ZlcmxheS5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtncm91bmRPdmVybGF5OiBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5fSB7XG4gICAgaWYgKCF0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEdyb3VuZE92ZXJsYXkgYmVmb3JlIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBHcm91bmRPdmVybGF5IHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgfVxufVxuIl19