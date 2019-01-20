//
//  ISMessages.m
//  ISMessages
//
//  Created by Ilya Inyushin on 08.09.16.
//  Copyright © 2016 Ilya Inyushin. All rights reserved.
//

#import "ISMessages.h"

static CGFloat const kDefaultCardViewHeight = 51.f;
static CGFloat const kDefaultInset = 12.f;

@interface ISMessages ()

// Content
@property (nonatomic, copy) NSString* titleString;
@property (nonatomic, copy) NSString* messageString;
@property (nonatomic, copy) NSString* alertTypeAcessibilityLabel;
@property (strong, nonatomic) UIImage* iconImage;

// Interaction

@property (assign, nonatomic) BOOL hideOnSwipe;
@property (assign, nonatomic) BOOL hideOnTap;

// Position

@property (assign, nonatomic) ISAlertPosition alertPosition;

// Duration

@property (assign, nonatomic) NSTimeInterval duration;

// Sizes

@property (assign, nonatomic) CGFloat messageLabelHeight;
@property (assign, nonatomic) CGFloat titleLabelHeight;
@property (assign, nonatomic) CGFloat alertViewHeight;
@property (assign, nonatomic) CGFloat statusBarHeight;
@property (assign, nonatomic) CGSize iconImageSize;

// callbacks

@property handler handler;
@property beginning beginning;
@property completion completion;

@end

@implementation ISMessages

static NSMutableArray* currentAlertArray = nil;

+ (instancetype)showCardAlertWithTitle:(NSString *)title
                               message:(NSString *)message
                              duration:(NSTimeInterval)duration
                           hideOnSwipe:(BOOL)hideOnSwipe
                             hideOnTap:(BOOL)hideOnTap
                             alertType:(ISAlertType)type
                         alertPosition:(ISAlertPosition)position
                               didHide:(completion)didHide {

    ISMessages* alert = [[ISMessages alloc] initCardAlertWithTitle:title
                                                           message:message
                                                         iconImage:nil
                                                          duration:duration
                                                       hideOnSwipe:hideOnSwipe
                                                         hideOnTap:hideOnTap
                                                         alertType:type
                                                     alertPosition:position];

    [alert show:nil didBegin:nil didHide:didHide];

    return alert;

}

+ (instancetype)cardAlertWithTitle:(NSString*)title
                           message:(NSString*)message
                         iconImage:(UIImage*)iconImage
                          duration:(NSTimeInterval)duration
                       hideOnSwipe:(BOOL)hideOnSwipe
                         hideOnTap:(BOOL)hideOnTap
                         alertType:(ISAlertType)type
                     alertPosition:(ISAlertPosition)position{

    ISMessages* alert = [[ISMessages alloc] initCardAlertWithTitle:title
                                                           message:message
                                                         iconImage:iconImage
                                                          duration:duration
                                                       hideOnSwipe:hideOnSwipe
                                                         hideOnTap:hideOnTap
                                                         alertType:type
                                                     alertPosition:position];
    return alert;

}

- (instancetype)initCardAlertWithTitle:(NSString*)title
                               message:(NSString*)message
                             iconImage:(UIImage*)iconImage
                              duration:(NSTimeInterval)duration
                           hideOnSwipe:(BOOL)hideOnSwipe
                             hideOnTap:(BOOL)hideOnTap
                             alertType:(ISAlertType)type
                         alertPosition:(ISAlertPosition)position{

    self = [super init];

    if (self) {

        if (!currentAlertArray) {
            currentAlertArray = [NSMutableArray new];
        }

        self.titleString = title;
        self.messageString = message;
        self.duration = duration;
        self.hideOnTap = hideOnTap;
        self.hideOnSwipe = hideOnSwipe;
        [self configureViewForAlertType:type iconImage:iconImage];
        self.iconImageSize = _iconImage == nil ? CGSizeZero : CGSizeMake(35.f, 35.f);
        self.alertPosition = position;

    }

    return self;

}

- (void)viewDidLoad {
    [super viewDidLoad];

    _statusBarHeight = [[UIApplication sharedApplication] statusBarFrame].size.height;

    // correct the height in case the statusbar is hidden and we're running on an 'X' model
    if (_statusBarHeight == 0) {
      if (@available(iOS 11.0, *)) {
          UIWindow *window = UIApplication.sharedApplication.keyWindow;
          _statusBarHeight = window.safeAreaInsets.top;
      }
    }

    // this makes the alert look nicer on non-'X' models when the statusbar is hidden
    if (_statusBarHeight == 0) {
      _statusBarHeight = 12;
    }

    CGFloat statusBarCorrection = (_alertPosition == ISAlertPositionBottom ? 0 : _statusBarHeight) + (_alertPosition == ISAlertPositionBottom ? 10 : (_statusBarHeight / 2));

    self.messageLabelHeight = ceilf([self preferredHeightForMessageString:_messageString]);
    self.titleLabelHeight = ceilf([self preferredHeightForTitleString:_titleString]);
    self.alertViewHeight = kDefaultInset + _titleLabelHeight + 3.f + _messageLabelHeight + kDefaultInset + statusBarCorrection;

    if (_alertViewHeight < kDefaultCardViewHeight) {
        self.alertViewHeight = kDefaultCardViewHeight;
    }

    CGFloat insetCorrection = 0;
    if (@available(iOS 11.0, *)) {
        if (_alertPosition == ISAlertPositionBottom) {
            UIWindow *window = UIApplication.sharedApplication.keyWindow;
            insetCorrection = window.safeAreaInsets.bottom;
        }
    }

    self.alertViewHeight += insetCorrection;

    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
    CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
    CGFloat alertYPosition = -_alertViewHeight;

    if (_alertPosition == ISAlertPositionBottom) {
        alertYPosition = screenHeight + _alertViewHeight;
    }

    self.view.backgroundColor = [UIColor clearColor];
    self.view.frame = CGRectMake(0, alertYPosition, screenWidth - 0, _alertViewHeight);

    self.view.alpha = 0.7f;
    self.view.layer.cornerRadius = 0.f;
    self.view.layer.masksToBounds = YES;

    // Make sure accessibility focus stays within the ISMessage.
    self.view.accessibilityViewIsModal = true;

    [self constructAlertCardView];

}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationDidChange:) name:UIDeviceOrientationDidChangeNotification object:nil];
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
}

- (bool)accessibilityPerformEscape {
    [self hide:@(YES)];
    return true;
}

- (void)deviceOrientationDidChange:(NSNotification *)notification {
    [self hide:@(YES)];
}

- (void)constructAlertCardView {

    UIView* alertView = [[UIView alloc] initWithFrame:CGRectMake(0.f, 0.f, self.view.frame.size.width, self.view.frame.size.height)];
    alertView.backgroundColor = _alertViewBackgroundColor;
    [self.view addSubview:alertView];

    CGFloat heightCorrection = _alertPosition == ISAlertPositionBottom ? -10.f : (_statusBarHeight > 0.f ? _statusBarHeight : 10.f);

    CGFloat insetCorrection = 0;
    if (@available(iOS 11.0, *)) {
        if (_alertPosition == ISAlertPositionBottom) {
            UIWindow *window = UIApplication.sharedApplication.keyWindow;
            insetCorrection = -window.safeAreaInsets.bottom;
        }
    }

    UIImageView* iconImage = [[UIImageView alloc] initWithFrame:CGRectMake(kDefaultInset, (_alertViewHeight - _iconImageSize.height + heightCorrection + insetCorrection) / 2.f, _iconImageSize.width, _iconImageSize.height)];
    iconImage.contentMode = UIViewContentModeScaleAspectFit;
    iconImage.image = _iconImage;
    iconImage.isAccessibilityElement = true;
    iconImage.accessibilityTraits = UIAccessibilityTraitButton;
    iconImage.accessibilityLabel = NSLocalizedString(@"OK", comment: "");
    [alertView addSubview:iconImage];

    heightCorrection = heightCorrection + (_alertPosition == ISAlertPositionBottom ? 10.0f : insetCorrection + (_statusBarHeight > 0.f ? (_statusBarHeight / 4) : 0.f));

    UILabel* titleLabel = [UILabel new];
    titleLabel.frame = CGRectMake((kDefaultInset*2.f) + _iconImageSize.width, kDefaultInset + heightCorrection, self.view.frame.size.width - ((kDefaultInset*3.f) + _iconImageSize.width), _titleLabelHeight);
    titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
    titleLabel.textAlignment = NSTextAlignmentLeft;
    titleLabel.numberOfLines = 0;
    titleLabel.textColor = _titleLabelTextColor;
    titleLabel.font = _titleLabelFont;
    titleLabel.text = _titleString;
    if (self.alertTypeAcessibilityLabel != nil) {
        titleLabel.accessibilityLabel = [NSString stringWithFormat:@"%@, %@", self.alertTypeAcessibilityLabel, _titleString];
    }
    [alertView addSubview:titleLabel];

    UILabel* messageLabel = [UILabel new];
    messageLabel.frame = CGRectMake((kDefaultInset*2.f) + _iconImageSize.width, kDefaultInset + heightCorrection + _titleLabelHeight + 3.f, self.view.frame.size.width - ((kDefaultInset*3.f) + _iconImageSize.width), _messageLabelHeight);
    messageLabel.lineBreakMode = NSLineBreakByWordWrapping;
    messageLabel.textAlignment = NSTextAlignmentLeft;
    messageLabel.numberOfLines = 0;
    messageLabel.textColor = _messageLabelTextColor;
    messageLabel.font = _messageLabelFont;
    messageLabel.text = _messageString;
    [alertView addSubview:messageLabel];

    // Sets custom order of accessibility elements.
    alertView.accessibilityElements = @[titleLabel, messageLabel, iconImage];

    if (_hideOnSwipe) {
        UISwipeGestureRecognizer* swipeGesture = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(gestureAction)];
        swipeGesture.direction = UISwipeGestureRecognizerDirectionUp | UISwipeGestureRecognizerDirectionDown;
        [alertView addGestureRecognizer:swipeGesture];
    }

    if (_hideOnTap) {
        UITapGestureRecognizer* tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(gestureActionWithHandler)];
        [alertView addGestureRecognizer:tapGesture];
    }

}

- (void)show:(handler)handler didBegin:(beginning)didBegin didHide:(completion)didHide {

    if (handler) {
        _handler = handler;
        UITapGestureRecognizer* tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(gestureActionWithHandler)];
        [self.view addGestureRecognizer:tapGesture];
    }

    if (didBegin) {
        _beginning = didBegin;
    }

    if (didHide) {
        _completion = didHide;
    }

    _beginning(true);
    [self performSelectorOnMainThread:@selector(showInMain) withObject:nil waitUntilDone:NO];
}

- (void)showInMain {

    if ([currentAlertArray count] != 0) {
        [self performSelectorOnMainThread:@selector(hide:) withObject:@(YES) waitUntilDone:YES];
    }

    @synchronized (currentAlertArray) {

        [[UIApplication sharedApplication].keyWindow addSubview:self.view];

        CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
        CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
        CGFloat alertYPosition = -10.f;

        if (_alertPosition == ISAlertPositionBottom) {
            alertYPosition = screenHeight - _alertViewHeight + 10;
        }

        [UIView animateWithDuration:0.5f
                              delay:0.f
             usingSpringWithDamping:(_alertPosition == ISAlertPositionBottom ? 0.72f : 0.65f)
              initialSpringVelocity:0.5f
                            options:UIViewAnimationOptionCurveEaseIn
                         animations:^{
                             self.view.frame = CGRectMake(0, alertYPosition, screenWidth, self->_alertViewHeight);
                             self.view.alpha = 1.f;
                         } completion:^(BOOL finished) {
                             self.view.frame = CGRectMake(0, alertYPosition, screenWidth, self->_alertViewHeight);
                             self.view.alpha = 1.f;
                             self->_beginning(false);
                         }];

        [currentAlertArray addObject:self];

        UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, self.view);

        // Auto-hide if significant duration is set and VoiceOver is off.
        if (_duration > 0.5f && !UIAccessibilityIsVoiceOverRunning()) {
            [self performSelector:@selector(hide:) withObject:@(NO) afterDelay:_duration];
        }
    }

}

- (void)hide:(NSNumber*)force {

    NSTimeInterval delayDuration = 0.f;

    if (self.view.layer.animationKeys) {
        delayDuration = 0.5f;
    }

    if (force.boolValue == YES) {
        [self performSelector:@selector(forceHideInMain) withObject:nil afterDelay:0.f];
    } else {
        [self performSelector:@selector(hideInMain) withObject:nil afterDelay:delayDuration];
    }

    if (_completion) {
        _completion(YES);
    }
}

- (void)gestureAction {
    [self hide:@(NO)];
}

- (void)gestureActionWithHandler {
    if (_handler) {
        _handler();
    }
    [self hide:@(NO)];
}

#pragma mark - Private Methods

- (void)hideInMain {

    if ([currentAlertArray containsObject:self]) {
        @synchronized (currentAlertArray) {

            [NSRunLoop cancelPreviousPerformRequestsWithTarget:self];
            [currentAlertArray removeObject:self];

            CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
            CGFloat alertYPosition = -_alertViewHeight;

            if (_alertPosition == ISAlertPositionBottom) {
                alertYPosition = screenHeight;
            }

            [UIView animateWithDuration:0.3f animations:^{
                self.view.alpha = 0.7;
                self.view.frame = CGRectMake(0, alertYPosition, self.view.frame.size.width, self.view.frame.size.height);
            } completion:^(BOOL finished) {
                self.view.alpha = 0.7;
                self.view.frame = CGRectMake(0, alertYPosition, self.view.frame.size.width, self.view.frame.size.height);
                [self.view removeFromSuperview];
                UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, nil);
            }];

        }
    }

}

- (void)forceHideInMain {

    if (currentAlertArray && [currentAlertArray count] > 0) {
        @synchronized (currentAlertArray) {

            ISMessages* activeAlert = currentAlertArray[0];
            [NSRunLoop cancelPreviousPerformRequestsWithTarget:activeAlert];
            [currentAlertArray removeObject:activeAlert];

            [UIView animateWithDuration:0.1f
                             animations:^{
                                 activeAlert.view.alpha = 0.f;
                             } completion:^(BOOL finished) {
                                 [activeAlert.view removeFromSuperview];
                                 [activeAlert removeFromParentViewController];
                                 UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, nil);
                             }];

        }
    }

}

+ (void)hideAlertAnimated:(BOOL)animated {

    if (currentAlertArray && [currentAlertArray count] != 0) {
        ISMessages* alert = currentAlertArray[0];
        [alert hide:[NSNumber numberWithBool:!animated]];
    }

}

- (CGFloat)preferredHeightForMessageString:(NSString*)message {

    if (!message || message.length == 0) {
        return ceilf(0.f);
    }

    NSMutableParagraphStyle* paragraphStyle = [[NSMutableParagraphStyle defaultParagraphStyle] mutableCopy];
    paragraphStyle.lineBreakMode = NSLineBreakByWordWrapping;
    paragraphStyle.alignment = NSTextAlignmentLeft;

    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;

    CGFloat messageHeight = [message boundingRectWithSize:CGSizeMake(screenWidth - 40.f - _iconImageSize.height, CGFLOAT_MAX)
                                                  options:NSStringDrawingUsesLineFragmentOrigin
                                               attributes:@{NSParagraphStyleAttributeName : paragraphStyle,
                                                            NSFontAttributeName : _messageLabelFont}
                                                  context:nil].size.height;

    return ceilf(messageHeight);

}

- (CGFloat)preferredHeightForTitleString:(NSString*)title {

    if (!title || title.length == 0) {
        return ceilf(0.f);
    }

    NSMutableParagraphStyle* paragraphStyle = [[NSMutableParagraphStyle defaultParagraphStyle] mutableCopy];
    paragraphStyle.lineBreakMode = NSLineBreakByWordWrapping;
    paragraphStyle.alignment = NSTextAlignmentLeft;

    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;

    CGFloat titleHeight = [title boundingRectWithSize:CGSizeMake(screenWidth - 40.f - _iconImageSize.height, CGFLOAT_MAX)
                                                  options:NSStringDrawingUsesLineFragmentOrigin
                                               attributes:@{NSParagraphStyleAttributeName : paragraphStyle,
                                                            NSFontAttributeName : _titleLabelFont}
                                                  context:nil].size.height;

    return ceilf(titleHeight);

}

- (UIImage*)imageNamed:(NSString*)name {
    NSBundle * pbundle = [NSBundle bundleForClass:[self class]];
    NSString *bundleURL = [pbundle pathForResource:@"ISMessages" ofType:@"bundle"];
    NSBundle *imagesBundle = [NSBundle bundleWithPath:bundleURL];
    UIImage * image = [UIImage imageNamed:name inBundle:imagesBundle compatibleWithTraitCollection:nil];
    return image;
}

- (void)configureViewForAlertType:(ISAlertType)alertType iconImage:(UIImage*)iconImage {

    self.titleLabelTextColor = [UIColor whiteColor];
    self.messageLabelTextColor = [UIColor whiteColor];
    if (@available(iOS 8.2, *)) {
        self.titleLabelFont = [UIFont systemFontOfSize:15.f weight:UIFontWeightMedium];
    } else {
        self.titleLabelFont = [UIFont systemFontOfSize:15.f];
    }
    self.messageLabelFont = [UIFont systemFontOfSize:15.f];

    self.iconImage = iconImage;

    switch (alertType) {
        case ISAlertTypeSuccess: {
            self.alertTypeAcessibilityLabel = NSLocalizedString(@"Success", comment: "");
            self.alertViewBackgroundColor = [UIColor colorWithRed:31.f/255.f green:177.f/255.f blue:138.f/255.f alpha:1.f];
            if (!_iconImage) {
                self.iconImage = [self imageNamed:@"isSuccessIcon"];
            }
            break;
        }
        case ISAlertTypeError: {
            self.alertTypeAcessibilityLabel = NSLocalizedString(@"Error", comment: "");
            self.alertViewBackgroundColor = [UIColor colorWithRed:255.f/255.f green:91.f/255.f blue:65.f/255.f alpha:1.f];
            if (!_iconImage) {
                self.iconImage = [self imageNamed:@"isErrorIcon"];
            }
            break;
        }
        case ISAlertTypeWarning: {
            self.alertTypeAcessibilityLabel = NSLocalizedString(@"Warning", comment: "");
            self.alertViewBackgroundColor = [UIColor colorWithRed:255.f/255.f green:134.f/255.f blue:0.f/255.f alpha:1.f];
            if (!_iconImage) {
                self.iconImage = [self imageNamed:@"isWarningIcon"];
            }
            break;
        }
        case ISAlertTypeInfo: {
            self.alertTypeAcessibilityLabel = NSLocalizedString(@"Info", comment: "");
            self.alertViewBackgroundColor = [UIColor colorWithRed:75.f/255.f green:107.f/255.f blue:122.f/255.f alpha:1.f];
            if (!_iconImage) {
                self.iconImage = [self imageNamed:@"isInfoIcon"];
            }
            break;
        }
        case ISAlertTypeCustom: {
            self.alertViewBackgroundColor = [UIColor colorWithRed:96.f/255.f green:184.f/255.f blue:237.f/255.f alpha:1.f];
            break;
        }
        default:
            break;
    }
}

- (void)dealloc {
    [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceOrientationDidChangeNotification object:nil];
    _completion = nil;
    _beginning = nil;
    _handler = nil;
}


@end
