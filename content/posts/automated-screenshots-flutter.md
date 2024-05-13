+++
date = 2024-02-13T09:00:00-07:00
title = "Automated screenshots in Flutter (without pain)"
tags = ["flutter", "screenshots"]
draft = false
+++

For me, screenshots of apps was always a painful theme. I think we've all 
been there: You find an absolutely perfect tool, it's simple and minimalistic (judging 
by screenshots from its website). You download it, open it, and it looks completely
different. It's a little bit disappointing. 

<!--more-->

<!--toc:start-->
- [Pre-made libraries and other ways](#pre-made-libraries-and-other-ways)
- [My solution](#my-solution)
  - [Step 1. Adding dependencies](#step-1-adding-dependencies)
  - [Step 2. Create test file](#step-2-create-test-file)
  - [Step 3. Write tests](#step-3-write-tests)
- [Ending](#ending)
<!--toc:end-->

## Pre-made libraries and other ways

I'm building my app with Flutter called
[sudoku](https://github.com/dudozermaks/sudoku). Just before the first release I
found out that I have no screenshots for my app. I had two options to make
them:

1. By hand
2. Using some kind of script

My app grows quickly and interface changes fast, which means that screenshotting by hand is
dumb idea. So I started looking into how I can implement automated screenshots.
I, again, had many options:

1. This
   [article](https://medium.com/@mregnauld/generate-screenshots-for-a-flutter-app-with-golden-testing-and-upload-them-to-the-stores-1-2-45f8df777aef).
   It is very complex in my opinion, and, I need simple plain screenshots
   without any text on them. Plus there is no source code available.
2. `auto_screenshot` library, which is working only if app uses deep-linking
   ([link](https://pub.dev/packages/auto_screenshot))
3. `screenshots` library, which is Dart 3 incompatible ([link](https://pub.dev/packages/screenshots))
4. ... and many more I forgot to list here

As you can see, I did not quite like any of these approaches. So, I tried to
create my own.

## My solution

My solution uses only `flutter_test` and `integration_test`. That's all! Here is
a [repo](https://github.com/dudozermaks/flutter_automated_screenshots_showcase) where you can find everything mentioned in this
guide.

### Step 1. Adding dependencies

Go to your project and open `pubspec.yaml`. Find a line that says
`dev_dependencies`. Add this lines somewhere at the bottom:
```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter

  integration_test:
    sdk: flutter
```
Run `flutter pub get`.

### Step 2. Create test file

Inside your project, create a folder called `integration_test`. Inside it, create
file named as you wish, but with `_test.dart` on the end. Mine is named
`screenshots_test.dart`. Inside this file, insert following lines:
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  // If you have something async to setup, before running your app,
  // do it in this function
  setUpAll(() async {
    // Right here.
  });
}
```

### Step 3. Write tests

At this step, our actions might be different, depending on the structure of your app. But I will
show you, how to do screenshots with standard app, which `flutter create
somename` produces.

I have this function, called `makeScreenshot`, here is what it does:
``` dart
void makeScreenshot(
    Widget w, String testName, String fileName, Function(WidgetTester) actions) {
  testWidgets(testName, (WidgetTester tester) async {
    // Change size of screen
    tester.view.physicalSize = const Size(1080 / 2, 1920 / 2);

    // Make flutter to simulate Android platform
    // This is done in order to get more Android-looking screenshots
    debugDefaultTargetPlatformOverride = TargetPlatform.android;

    // Adding widget to the test
    await tester.pumpWidget(w);

    // Waiting a little, so that flutter renders it
    // Might be unnecessary in your case
    await tester.pumpAndSettle(const Duration(milliseconds: 100));

    await actions(tester);

    // The golden test: Finding our app in the test by type, and
    // comparing it with previous screenshot
    await expectLater(
      find.byType(MyApp),
      matchesGoldenFile('screenshots/$fileName.png'),
    );

    // To prevent an error, setting this to null
    debugDefaultTargetPlatformOverride = null;
  });
}
```

With this function I can create some nice-looking screenshots of my default app.
At the end of `main` function I inserted this:

```dart
makeScreenshot(
  const MyApp(),
  "Default page",
  "default_page",
  // No need to do anything in test, simple home page screenshot
  (tester) => null,
);
```

Then I run `flutter test integration_test --update-goldens`. And there I have
it! Screenshot of default page located at
`integration_test/screenshots/default_page.png`.

![First screenshot](https://raw.githubusercontent.com/dudozermaks/flutter_automated_screenshots_showcase/main/integration_test/screenshots/default_page.png)

"But that's boring", you might say, "What if I need to click on some buttons or do something else
before screenshot is taken?" I got you, that is easy too! Let's say that we have
a button with an `add` icon on this page, and we want to tap on it. Just add
another `makeScreenshot` call below the first one and modify it a bit.

```dart
makeScreenshot(
  const MyApp(),
  "Incremented page",
  "incremented_page",
  (tester) async {
    // finding button by Icon and tapping on it
    await tester.tap(find.byIcon(Icons.add));
    // waiting a little bit
    await tester.pumpAndSettle();
  },
);
```

`find` and `tester` have other useful methods. You can find them in the
documentation, both for
  [find](https://api.flutter.dev/flutter/flutter_test/CommonFinders-class.html)
  and [tester](https://api.flutter.dev/flutter/flutter_test/WidgetTester-class.html).

Run `flutter test integration_test --update-goldens` again, and there you have
it, another screenshot.

![Second
screenshot](https://raw.githubusercontent.com/dudozermaks/flutter_automated_screenshots_showcase/main/integration_test/screenshots/incremented_page.png)

## Ending

<a href="https://www.buymeacoffee.com/dudozer_maks"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=dudozer_maks&button_colour=d46f11&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" /></a>

That's it for now! Again, you can find everything I did here in this GitHub
[repo](https://github.com/dudozermaks/flutter_automated_screenshots_showcase). Also, here is an
[example](https://github.com/dudozermaks/sudoku/blob/8a6713e614dd1e51ef4b12a5d6440cae54ce2c01/integration_test/screenshots_test.dart) of how I do it in my
project.
