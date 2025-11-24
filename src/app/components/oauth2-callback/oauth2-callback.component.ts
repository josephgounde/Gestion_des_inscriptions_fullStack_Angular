// src/app/components/oauth2-callback/oauth2-callback.component.ts

@Component({...})
export class OAuth2CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 1. Extract the token from the URL query parameter (e.g., /oauth2/callback?token=...)
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');

      if (token) {
        // 2. Save the token and navigate to the protected area
        this.authService.handleOAuth2Callback(token);
        this.router.navigate(['/dashboard']);
      } else {
        // Handle error if token is missing
        this.router.navigate(['/login'], { queryParams: { error: true } });
      }
    });
  }
}
