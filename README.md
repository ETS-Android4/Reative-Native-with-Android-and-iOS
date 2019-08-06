# React Native Activity Demo

This project demonstrates the following:

* Call from JavaScript into native modules:
  * These use a custom native module called `ActivityStarter`:
    * Navigate from React Native to a Java activity (or iOS view controller) internal to the host app;
    * Query the host app for information.
    * Navigate from Java to React Native
  * This uses the native module `Clipboard`, which [comes with React Native out of the box](https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/modules/clipboard/ClipboardModule.java):
    * Copy information to the clipboard.
* Call a JavaScript method from Java or Objective-C, using an officially undocumented approach.
* Demonstrate sending events from the native platform to JavaScript. (When possible, prefer this approach to the undocumented one.)
* Verify that custom edit menu extensions work with React Native `TextInput`. (Android only.)
* Add a custom menu option to React Native debug menu.

There is no technical difference between the `ActivityStarter` and `Clipboard` native modules, except one is defined here, while the other ships as part of React Native.

The starting point for this sample is a slightly tweaked standard React Native project as generated by a long-outdated version of `react-native init`. We add six buttons to the generated page:

The `TextInput` box appears only in the Android version. Since both platforms use the same JavaScript, I took the opportunity to demonstrate how to handle platform-specific tweaks &ndash; look for `Platform.select` in [`index.android.js`](index.android.js).

## Getting started

<!-- markdownlint-disable MD031 -->

* Install [Git](https://git-scm.com/downloads).
* Install [Node.js](https://nodejs.org/en/download/).
* Install [Yarn](https://yarnpkg.com/lang/en/docs/install/#windows-stable). Use a shell with Git, Node and Yarn in the path for all commands.
* Clone this project:\
  `git clone https://github.com/petterh/react-native-android-activity.git`\
  (Alternatively, create your own fork and clone that instead.)
* `cd react-native-android-activity`
* Run `yarn` to download dependencies
* For Android development (using Windows, Mac or Linux), install [Android Studio](https://developer.android.com/studio/install.html) (follow instructions [on this page](https://facebook.github.io/react-native/docs/getting-started.html)).
* For iOS development (Mac only), install [Xcode](https://developer.apple.com/xcode/).
* By default, the debug build of the app loads the JS bundle from your dev box, so start a bundler:
  ```cmd
  yarn start
  ```

### Android

* Connect an Android device via USB, or use an emulator. [Don't forget to enable USB Debugging in Developer options](https://developer.android.com/studio/run/device).
* Open the app in Android Studio and run it.
* If this fails with the message "Could not get BatchedBridge, make sure your bundle is packaged correctly", your packager is likely not running.
* If it complains about connecting to the dev server, run `adb reverse tcp:8081 tcp:8081`
* If it crashes while opening the ReactNative controls, try to modify the following phone settings:
**Android Settings -> Apps -> Settings once again (the gear) to go to Configure Apps view -> Draw over other apps -> Allow React Native Android Activity Demo to draw over other apps**. (The demo app *should* ask for this automatically, though.)
* To embed the bundle in the apk (and not have to run the packager), set `bundleInDebug=true` in `android/gradle.properties`.

### iOS

* Open the xOS project in Xcode and run it. This automatically starts a bundler.

<!-- markdownlint-enable MD031 -->

### JavaScript

TODO


## The React Native side

The gist of the JavaScript code looks like this:

```javascript
import settingsPage from './settingsPage';
 import RecipeDetailPage from './RecipeDetailPage';

 import React, { Component } from 'react';

 import {
   AppRegistry,
   Button,
   NativeEventEmitter,
   NativeModules,
   Platform,
   StyleSheet,
   Text,
   Dimensions,
   TextInput,
   SafeAreaView,
   TouchableHighlight,
   View,
 } from 'react-native';

 import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge";

 export class ExposedToJava {
   extraMessage = "Be aware that this way of calling JavaScript is officially undocumented.\n\nIf possible, use events instead!";

   setMessage(message) {
     this.extraMessage = message;
   }

   /**
    * If this is called from an activity that doesn't forward Android life-cycle events
    * to React Native, the alert will appear to do nothing.
    */
   alert(message) {
       alert(message + "\n\n" + this.extraMessage);
   }
 }

 const exposedToJava = new ExposedToJava();
 BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);

 const activityStarter = NativeModules.ActivityStarter;
 const eventEmitterModule = NativeModules.EventEmitter;

 export default class ActivityDemoComponent extends Component {
   constructor(props) {
     super(props);
     this.state = { text: 'Demo text for custom edit menu' };
   }

   render() {
     return (
       <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>

       <View style={styles.container} >
       <View style={{
         flex: 1,
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'stretch',
       }}>
       <TouchableHighlight onPress={() => activityStarter.navigateToExample()} underlayColor="white" style={{width:Dimensions.get('window').width, height:"25%"}}>
             <Text style={styles.button}>no</Text>
       </TouchableHighlight>
       <TouchableHighlight onPress={() => activityStarter.navigateToExample()} underlayColor="white" style={{width:Dimensions.get('window').width, height:"25%"}}>
             <Text style={styles.button}>no</Text>
       </TouchableHighlight>
       <TouchableHighlight onPress={() => activityStarter.navigateToExample()} underlayColor="white" style={{width:Dimensions.get('window').width, height:"25%"}}>
             <Text style={styles.button}>no</Text>
       </TouchableHighlight>
       <TouchableHighlight onPress={() => activityStarter.navigateToExample()} underlayColor="white" style={{width:Dimensions.get('window').width, height:"25%"}}>
             <Text style={styles.button}>no</Text>
       </TouchableHighlight>
       </View>


       </View>
       </SafeAreaView>

     );
   }
 }

 const styles = StyleSheet.create({
   bold: {
     fontWeight: "bold",
   },
   x: {
     width: "100%",
   },
   button: {
       width: "100%",
       height:"100%",
       backgroundColor: '#C72727',
       alignItems: 'center',
       justifyContent: 'center'
     },
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#E5ECFF',
     width: "100%",
   },

 });

 AppRegistry.registerComponent('ActivityDemoComponent', () => ActivityDemoComponent);
 AppRegistry.registerComponent('ActivityDemoComponent2', () => settingsPage);
 AppRegistry.registerComponent('RecipeDetailPage', () => RecipeDetailPage);


 const eventEmitter = new NativeEventEmitter(eventEmitterModule);
 eventEmitter.addListener(eventEmitterModule.MyEventName, (params) => {
   exposedToJava.setMessage(params);
   alert(params);
 });

```

The buttons use methods on `NativeModules.ActivityStarter`. Where does this come from?

## Android: The Java module

`ActivityStarter` is just a Java class that implements a React Native Java interface called `NativeModule`. The heavy lifting of this interface is already done by `BaseJavaModule`, so one normally extends either that one or `ReactContextBaseJavaModule`:

```java
final public class ActivityStarterModule extends ReactContextBaseJavaModule {

    ActivityStarterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from JavaScript.
     */
    @Override
    public String getName() {
        return "ActivityStarter";
    }

    @ReactMethod
    void navigateToDashboard() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, RecipeListActivity.class);
            activity.startActivity(intent);
        }
    }

    @ReactMethod
    void navigateToExample() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, RecipeListActivity.class);
            activity.startActivity(intent);
        }
    }

    @ReactMethod
    void dialNumber(@NonNull String number) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + number));
            activity.startActivity(intent);
        }
    }

    @ReactMethod
    void getActivityName(@NonNull Callback callback) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            callback.invoke(activity.getClass().getSimpleName());
        } else {
            callback.invoke("No current activity");
        }
    }

    @ReactMethod
    void getActivityNameAsPromise(@NonNull Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            promise.resolve(activity.getClass().getSimpleName());
        } else {
            promise.reject("NO_ACTIVITY", "No current activity");
        }
    }

    @ReactMethod
    void callJavaScript() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            MainApplication application = (MainApplication) activity.getApplication();
            ReactNativeHost reactNativeHost = application.getReactNativeHost();
            ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

            if (reactContext != null) {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                WritableNativeArray params = new WritableNativeArray();
                params.pushString("Hello, JavaScript!");

                // AFAIK, this approach to communicate from Java to JavaScript is officially undocumented.
                // Use at own risk; prefer events.
                // Note: Here we call 'alert', which shows UI. If this is done from an activity that
                // doesn't forward lifecycle events to React Native, it wouldn't work.
                catalystInstance.callFunction("JavaScriptVisibleToJava", "alert", params);
            }
        }
    }
}
```

The name of this class doesn't matter; the `ActivityStarter` module name exposed to JavaScript comes from the `getName()` method.

Each method annotated with a `@ReactMethod` attribute is accessible from JavaScript. Overloads are not allowed, though; you have to know the method signatures. (The out-of-the-box `Clipboard` module isn't usually accessed the way I do it here; React Native includes [`Clipboard.js`](https://github.com/facebook/react-native/blob/master/Libraries/Components/Clipboard/Clipboard.js), which [makes the thing more accessible from JavaScript](https://facebook.github.io/react-native/docs/clipboard.html) &ndash; if you're creating modules for public consumption, consider doing something similar.)

A `@ReactMethod` must be of type `void`. In the case of `getActivityName()` we want to return a string; we do this by using a callback.

## Android: Connecting the dots

The default app generated by `react-native init` contains a `MainApplication` class that initializes React Native. Among other things it extends `ReactNativeHost` to override its `getPackages` method:

```java
@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
            new MainReactPackage()
    );
}
```

This is the point where we hook our Java code to the React Native machinery. Create a class that implements `ReactPackage` and override `createNativeModules`:

```java
class ActivityStarterReactPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ActivityStarterModule(reactContext));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```

Finally, update `MainApplication` to include our new package:

```java
public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new ActivityStarterReactPackage(),
                    new MainReactPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
    }
}
```

## Android: Calling JavaScript from Java

This demo is invoked by the last button on the page:

```javascript
<Button
    onPress={() => NativeModules.ActivityStarter.callJavaScript()}
    title='Call JavaScript from Java'
/>
```

The Java side looks like this (in `ActivityStarterReactPackage` class):

```java
@ReactMethod
void callJavaScript() {
    Activity activity = getCurrentActivity();
    if (activity != null) {
        MainApplication application = (MainApplication) activity.getApplication();
        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if (reactContext != null) {
            CatalystInstance catalystInstance = reactContext.getCatalystInstance();
            WritableNativeArray params = new WritableNativeArray();
            params.pushString("Hello, JavaScript!");
            catalystInstance.callFunction("JavaScriptVisibleToJava", "alert", params);
        }
    }
}
```

The JavaScript method we're calling is defined and made visible to Java as follows:

```javascript
import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge";

export class ExposedToJava {
  alert(message) {
      alert(message);
  }
}

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);
```

## Android: Navagating from Android To react Native

Start this Activity in the normal way , with a startActivity , with an intent, aswell as showing how we pass data from intent extra to javascript

```java
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class RecipesDetailsActivity extends ReactActivity {
    public static final String KEY = "key1";
    private Bundle mInitialProps = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Bundle bundle = this.getIntent().getExtras();
        if (bundle != null && bundle.containsKey(KEY)) {
            mInitialProps = new Bundle();
            mInitialProps.putString(KEY, bundle.getString(KEY));
        }
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     * Because this class overrides {@link #createReactActivityDelegate()}, we don't really need
     * to override this.
     */
    @Override
    protected String getMainComponentName() {
        return "RecipeDetailPage";
    }

    /**
     * We override to provide launch options that we can read in JavaScript (see buildType).
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected Bundle getLaunchOptions() {
                Bundle launchOptions = new Bundle();
                launchOptions.putString("buildType", BuildConfig.BUILD_TYPE);
                launchOptions.putString(KEY, getIntent().getStringExtra(KEY));
                return launchOptions;
            }
        };
    }
}
```
## iOS: Navagating from iOS To react Native
This can be start with the normal way thought segways in storayboards linked to backing viewcontrollers
or thought just making a viewcontroller and pushing ont he nav controller

```swift
import Foundation
import React
class RecipesDetailsViewController: UIViewController {
  var detail: RCTRootView!
  var id = "";
  override func viewDidLoad() {
    let appDelegate = UIApplication.shared.delegate as! AppDelegate

    detail = RCTRootView(bridge: appDelegate.reactBridge, moduleName: "RecipeDetailPage", initialProperties: ["key1":id])

    self.view.addSubview(detail)
    
    
  }
  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    detail.frame = self.view.bounds
    
  }
}

```

## Android: Summary

1. The main application class initializes React Native and creates a `ReactNativeHost` whose `getPackages` include our package in its list.
1. `ActivityStarterReactPackage` includes `ActivityStarterModule` in its native modules list.
1. `ActivityStarterModule` returns "ActivityStarter" from its `getName` method, and annotates three methods with the `ReactMethod` attribute.
1. JavaScript can access `ActivityStarter.getActivityName` and friends via `NativeModules`.

## iOS

The iOS Objective-C classes are parallel to the Android Java classes. There are differences:

* Modules are picked up automatically.
* There is no react application context; instead there is the react native bridge, which is initialized in the [`AppDelegate`](ios/Activity/AppDelegate.m) class.
* Events are done somewhat differently. In Android we can just grab a `DeviceEventManagerModule.RCTDeviceEventEmitter` and fire away; in iOS it is necessary to subclass `RCTEventEmitter`.

Here is a sample of an Objective-C class implementation with methods callable from JavaScript:

```obj-c
@implementation ActivityStarterModule

RCT_EXPORT_MODULE(ActivityStarter);

RCT_EXPORT_METHOD(navigateToExample)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    [appDelegate navigateToExampleView];
  });
}

RCT_EXPORT_METHOD(getActivityName:(RCTResponseSenderBlock) callback)
{
  callback(@[@"ActivityStarter (callback)"]);
}

@end
```

## iOS: Calling JavaScript from Java

This requires the react native bridge, so responsibility resides with the `AppDelegate` class, for convenience.

```obj-c
- (void) callJavaScript
{
  [self.reactBridge enqueueJSCall:@"JavaScriptVisibleToJava"
                           method:@"alert"
                             args:@[@"Hello, JavaScript!"]
                       completion:nil];
}
```

## Further reading

* [Native Modules on Android](https://facebook.github.io/react-native/docs/native-modules-android.html)
* [Native Modules on iOS](https://facebook.github.io/react-native/docs/native-modules-ios)

## Trouble Shooting

* Check the version of react native you are importing in to projects matchs the version you have.
* If problems with building make sure build files are point at the correct level of 


