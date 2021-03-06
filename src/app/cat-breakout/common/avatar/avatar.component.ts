import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, AfterViewInit } from '@angular/core';
import { takeUntil, skip } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Selection, BaseType, select } from 'd3-selection';
import { arc, Arc, DefaultArcObject } from 'd3-shape';

import { Player } from '../../../cat-breakout/models/player.model';
import { PlayerService } from '../../../cat-breakout/services/player.service';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store.model';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush // The avatar doesn't change state often so let's manually control in order to save on cycles
})
export class AvatarComponent implements OnInit, AfterViewInit, OnDestroy {

    player: Player;
    store: Store;

    // Level progress variables
    svg: Selection<BaseType, {}, HTMLElement, any>;
    g: Selection<BaseType, {}, HTMLElement, any>;
    progress: Selection<SVGGElement, {}, HTMLElement, any>;
    arcGenerator: Arc<any, DefaultArcObject>;
    radius = 125;

    leveledUp: boolean;

    protected unsubscribe = new Subject();

    //////////////////////////////

    constructor(private playerService: PlayerService, private storeService: StoreService, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.player = this.playerService.player;
        this.store = this.storeService.store;

        this.playerService.playerChanged$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(_ => {
                this.updateProgress();
                // Tell Angular to update the data binding
                this.cdr.markForCheck();
            });

        this.playerService.levelChanged$
            .pipe(skip(1), takeUntil(this.unsubscribe))
            .subscribe(_ => {
                // Draw attention to the fact that the user just leveled up!
                this.leveledUp = true;
                setTimeout(_ => this.leveledUp = false, 4000);
                this.cdr.markForCheck();
            });

        this.storeService.skinChanged$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(_ => {
                // Tell Angular to update the data binding
                this.cdr.markForCheck();
            });
    }

    ngAfterViewInit() {
        this.initPlayerProgress();
    }

    initPlayerProgress() {
        const width = 250;
        const height = 250;
        const τ = 2 * Math.PI;

        this.g = select('.level-progress')
            .append('svg')
            .attr('width', '100%')
            .attr('height', height)
            .attr('preserveAspectRatio', 'xMidYMid meet')       // This is important for responsiveness
            .attr('viewBox', `0 0 ${width} ${height}`)          // This is important for responsiveness
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2 - 12})`);

        this.addDefs();

        this.progress = this.g
            .append('g')
            .attr('class', 'progress-dial');

        this.arcGenerator = arc()
            .startAngle(0)
            .endAngle(_ => this.player.levelPercentComplete / 100 * τ)
            .innerRadius(this.radius * 0.9)         // This is the size of the donut hole
            .outerRadius(this.radius)
            .cornerRadius(10)
            .padAngle(.02);

        this.progress
            .append('path')
            .attr('d', (d: any) => this.arcGenerator(d))
            .attr('fill', '#ff00006e')
            .style('stroke-width', '3px')
            .style('fill', 'url(#gradient0)');
    }

    updateProgress() {
        if (!this.progress) { return; }

        this.progress.select('path').attr('d', (d: any) => this.arcGenerator(d));
    }

    addDefs() {
        // Generate this markup:
        //     <defs>
        //     <linearGradient x1="0%" y1="100%" x2="50%" y2="0%" spreadMethod="pad" id="gradient0">
        //       <stop offset="0%" stop-color="#ffff00" stop-opacity="1"></stop>
        //       <stop offset="100%" stop-color="#ff0000" stop-opacity="1"></stop>
        //     </linearGradient>
        //   </defs>

        const defs = this.g.append('svg:defs');
        const gradient = defs.append('svg:linearGradient')
            .attr('id', 'gradient0')
            .attr('x1', '0%')
            .attr('y1', '100%')
            .attr('x2', '50%')
            .attr('y1', '0%')
            .attr('spreadMethod', 'pad')

        gradient.append('svg:stop').attr('offset', '0%').attr('stop-color', '#ff718a').attr('stop-opacity', '1')
        gradient.append('svg:stop').attr('offset', '100%').attr('stop-color', '#ff718a').attr('stop-opacity', '.9')

    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
