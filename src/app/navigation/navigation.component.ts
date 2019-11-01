import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router, RouterEvent} from '@angular/router';

declare var H: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'HereMapDemo';

  @ViewChild('map', { static: true }) public mapElement: ElementRef;

  public lat: any = '23.777176';
  public lng: any = '90.399452';

  public width: any = '100vw';
  public height: any = '100vh';

  private platform: any;
  private map: any;

  private _appId = 'dtUD0nbDM4MWxr1m69FR';
  private _appCode = 'kfMuthF1Tle6VxkwPyEmFA';

  public query: string;
  private search: any;
  private ui: any;





  mobileQuery: MediaQueryList;
  @ViewChild('snav', { static: true }) theSidenav;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.query = '';
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = router.url;
    });

  }

  // Dynamic SideNav Link..
  sideNavLink = [
    {
      title: 'Home',
      icon: 'home',
      url: '/'
    },
    {
      title: 'Directions',
      icon: 'directions',
      url: ''
    },
    {
      title: 'Traffic',
      icon: 'directions_car',
      url: ''
    },
    {
      title: 'Collections',
      icon: 'stars',
      url: ''
    },
    {
      title: 'Places',
      icon: 'local_cafe',
      url: ''
    },
    {
      title: 'Sign in',
      icon: 'exit_to_app',
      url: ''
    },
    {
      title: 'Contact Us',
      icon: 'local_post_office',
      url: ''
    },
  ];
  // For Active Design..
  selectedPath = '';
  private _mobileQueryListener: () => void;


  ngOnInit(): void {
    this.platform = new H.service.Platform({
      'app_id': this._appId,
      'app_code': this._appCode,
      useHTTPS: true
    });
    this.search = new H.places.Search(this.platform.getPlacesService());

    console.log('%cDeveloped by Md Iqbal Hossen', 'color: red; font-size: xx-large');
  }

  public ngAfterViewInit() {
    const pixelRatio = window.devicePixelRatio || 1;
    const defaultLayers = this.platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    this.map = new H.Map(this.mapElement.nativeElement,
      defaultLayers.normal.map, { pixelRatio: pixelRatio });

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    const ui = H.ui.UI.createDefault(this.map, defaultLayers);

    this.map.setCenter({ lat: this.lat, lng: this.lng });
    this.map.setZoom(14);

    const marker1 = new H.map.Marker({lat: this.lat, lng: this.lng});
    const marker2 = new H.map.Marker({lat: '23.7984941', lng: '90.3842619'});
    this.map.addObject(marker1);
    this.map.addObject(marker2);

    const lineString = new H.geo.LineString();
    lineString.pushPoint(marker1.getPosition());
    lineString.pushPoint(marker2.getPosition());

    // const polyLine = new H.map.PolyLine(
    //   lineString,
    //   {
    //     style: {
    //       strokeColor: 'red',
    //       lineWidth: 5
    //     }
    //   }
    // );
    //
    // this.map.addObject(polyLine);


  }

  public places(query: string) {
    this.map.removeObjects(this.map.getObjects());
    this.search.request({ 'q': query, 'at': this.lat + ',' + this.lng }, {}, data => {
      for (let i = 0; i < data.results.items.length; i++) {
        this.dropMarker({ 'lat': data.results.items[i].position[0], 'lng': data.results.items[i].position[1] }, data.results.items[i]);
        if (i === 0) {
          this.map.setCenter({ lat: data.results.items[i].position[0], lng: data.results.items[i].position[1] });
        }
      }
    }, error => {
      console.error(error);
    });
  }

  private dropMarker(coordinates: any, data: any) {
    const marker = new H.map.Marker(coordinates);
    marker.setData('<p>' + data.title + '<br>' + data.vicinity + '</p>');
    marker.addEventListener('tap', event => {
      const bubble = new H.ui.InfoBubble(event.target.getPosition(), {
        content: event.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);
    this.map.addObject(marker);
  }


  // Open Close Toggle with device width
  sideLinkClick() {
    this.theSidenav.close();
  }



  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
