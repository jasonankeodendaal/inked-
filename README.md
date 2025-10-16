# Building the Android APK for Beautively Inked

This guide provides instructions on how to take the web application and compile it into an Android APK file, ready for distribution or submission to the Google Play Store.

We will use **Trusted Web Activity (TWA)**, which is the official Google-recommended method for packaging a high-quality Progressive Web App (PWA) as an Android app.

## Prerequisites

1.  **Install Android Studio**: Download and install the latest version of Android Studio from the [official website](https://developer.android.com/studio). This is a free tool provided by Google.
2.  **Your Keystore File**: To sign your app for release, you need a digital signature. If you don't have one, Android Studio will help you create one. **Keep this file safe and back it up! You cannot update your app without it.**

---

## Step 1: Create a New Android Studio Project

1.  Open Android Studio.
2.  Click on "**New Project**".
3.  Select the "**No Activity**" template from the "Phone and Tablet" tab and click **Next**.
4.  Configure your project:
    *   **Name**: `Beautively Inked`
    *   **Package name**: `com.beautively.inked` (You can change this, but it must be unique. Make sure to update it in the files provided if you do).
    *   **Save location**: Choose a folder on your computer for the project.
    *   **Minimum SDK**: Select `API 23: Android 6.0 (Marshmallow)`.
    *   Click **Finish**.

Android Studio will now create and build the basic project structure. This might take a few minutes.

---

## Step 2: Replace Configuration Files

I have generated the necessary configuration files for you. You will replace the files created by Android Studio with the ones from this project.

1.  Navigate to the project folder you just created in Android Studio.
2.  Copy the `android/app/build.gradle` file from this project and use it to **replace** the `app/build.gradle` file in your new Android Studio project.
3.  Copy the `android/app/src/main/AndroidManifest.xml` file from this project and use it to **replace** the `app/src/main/AndroidManifest.xml` file in your Android Studio project.
4.  Copy the `android/app/src/main/res/values/strings.xml` file from this project and use it to **replace** the `app/src/main/res/values/strings.xml` file in your Android Studio project.

After replacing the files, Android Studio may show a notification bar that says "**Gradle files have changed...**". Click "**Sync Now**".

---

## Step 3: Deploy the `assetlinks.json` File

To verify the connection between your app and your website, you must host a file on your website at a specific URL.

1.  **Upload the File**: Take the `public/.well-known/assetlinks.json` file from this project and upload it to your web server.
2.  **Verify the URL**: The file **must** be accessible at `https://[YOUR_WEBSITE_DOMAIN]/.well-known/assetlinks.json`.
3.  **Update Your Signature**: The provided `assetlinks.json` has a placeholder for the `sha256_cert_fingerprints`. You need to replace it with your own app's signature.
    *   In Android Studio, go to **View > Tool Windows > Build Variants**.
    *   Select the **release** variant.
    *   Go to **Build > Generate Signed Bundle / APK...**.
    *   Select **APK**, click **Next**.
    *   Click "**Create new...**" to create a new keystore file. Fill in the details and save it somewhere safe.
    *   Once you have your keystore, you can get the SHA-256 fingerprint by running a command in the Android Studio terminal:
        ```bash
        keytool -list -v -keystore [path/to/your/keystore.jks] -alias [your_alias_name]
        ```
    *   Copy the SHA-256 fingerprint value and paste it into your `assetlinks.json` file, then re-upload the file to your server.

---

## Step 4: Build the Signed APK

Now you are ready to build the final APK file.

1.  In Android Studio, go to **Build > Generate Signed Bundle / APK...**.
2.  Select **APK** and click **Next**.
3.  For the **Key store path**, select the keystore file you created in the previous step.
4.  Enter your keystore password, key alias, and key password.
5.  Click **Next**.
6.  For **Build Variants**, select **release**.
7.  Click **Finish**.

Android Studio will build your app. Once it's done, you'll see a notification with a link to "**locate**" the APK file on your computer. This `app-release.apk` is the file you can install on Android devices or upload to the Google Play Store.
