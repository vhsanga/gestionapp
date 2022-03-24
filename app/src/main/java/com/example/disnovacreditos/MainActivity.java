package com.example.disnovacreditos;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.drawable.ColorDrawable;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Environment;
import android.os.Looper;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import com.example.disnovacreditos.databinding.ActivityMainBinding;

import android.view.Menu;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;

import org.apache.commons.io.FileUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;
    private ActivityMainBinding binding;
    private Context context;
    static final int REQUEST_IMAGE_CAPTURE = 1;
    private Uri mImageUri;
    WebView mWebView;
    String strHtmlFoto = "";
    static final int PERMISSION_REQUEST_CONTACTS = 1001;
    static final int REQUEST_TAKE_PHOTO = 2001;
    String currentPhotoPath;
    FusedLocationProviderClient mFusedLocationClient;
    int PERMISSION_ID = 44;
    double latitud;
    double longitud;
    private DrawView paint;
    private Uri fileUri;
    private String filePath;
    private final static int PICKFILE_RESULT_CODE=1;
    int coficienteCalidad=1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        context = this;
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setContentView(R.layout.activity_main);
        String[] permissionRequests = {
                Manifest.permission.WRITE_EXTERNAL_STORAGE
        };

        checkDownloadPermission();
        checkPermissions(permissionRequests);
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        mWebView = (WebView) findViewById(R.id.activity_main_webview);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        mWebView.addJavascriptInterface(new WebAppInterface(context), "Android");

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .addPathHandler("/assets/assets/app-js/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        mWebView.setWebViewClient(new LocalContentWebViewClient(assetLoader));

        mWebView.loadUrl("file:///android_asset/index.html");

        mWebView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading (WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                //tell what to happen here
            }
        });

        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype));
                request.setDescription("Descargando...");
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype));
                DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                dm.enqueue(request);
                Toast.makeText(getApplicationContext(), "Descargando...", Toast.LENGTH_SHORT).show();
                registerReceiver(onComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
            }
            BroadcastReceiver onComplete = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    Toast.makeText(getApplicationContext(), "Descarga Completa", Toast.LENGTH_SHORT).show();
                }
            };
        });

    }


    public void checkPermissions(String[] permissionRequests) {
        final ArrayList<String> permissionRequestList = new ArrayList<String>();

        for (final String request : permissionRequests) {
            if (ContextCompat.checkSelfPermission(this, request) != PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(this, request)) {   // Redundant in this case
                    permissionRequestList.add(request);
                } else {
                    permissionRequestList.add(request);
                }
            }
        }

        /*if (!permissionRequestList.isEmpty()) {
            final String[] results = new String[permissionRequestList.size()];
            permissionRequestList.toArray(results);

            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("info");

            String msg = "Es necesario que conceda todos los permisos.";
            for (String str : results)
                msg += ("\n- "+ str);

            builder.setMessage(msg);
            builder.setIcon(android.R.drawable.ic_dialog_info);

            builder.setNeutralButton("OK", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    ActivityCompat.requestPermissions(MainActivity.this, results, PERMISSION_REQUEST_CONTACTS);
                }
            });
            AlertDialog dialog = builder.create();
            dialog.show();
        }*/
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case PERMISSION_REQUEST_CONTACTS: {
                for (int i = 0; i < grantResults.length; i++) {
                    if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        Toast.makeText(this, permissions[i] + " permission granted.", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(this, permissions[i] + " permission denied.", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        }


        if (requestCode == PERMISSION_ID) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                getLastLocation();
            }
        }

    }


    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyMMdd_HHmmss").format(new Date());
        String imageFileName = "IMAGE_" + timeStamp + "_";
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        // If you saved your photo to the directory provided by getExternalFilesDir(),
        // the media scanner cannot access the files because they are private to your app.
        File image = File.createTempFile(imageFileName, ".jpg", storageDir);
        currentPhotoPath = image.getAbsolutePath();

        return image;
    }




    private void checkDownloadPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this, android.Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Toast.makeText(MainActivity.this, "Write External Storage permission allows us to save files. Please allow this permission in App Settings.", Toast.LENGTH_LONG).show();
        } else {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, 100);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }

    @Override
    protected void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        mWebView.saveState(bundle);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState)
    {
        super.onRestoreInstanceState(savedInstanceState);
        mWebView.restoreState(savedInstanceState);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_TAKE_PHOTO && resultCode == RESULT_OK) {
            Bitmap originalBitmap = BitmapFactory.decodeFile(currentPhotoPath);
            File file = new File(currentPhotoPath);
            file.delete();
            if(file.exists()){
                try {
                    file.getCanonicalFile().delete();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if(file.exists()){
                    getApplicationContext().deleteFile(file.getName());
                }
            }

            int scaleFactor = coficienteCalidad;
            Bitmap scaledBitmap = Bitmap.createScaledBitmap(originalBitmap, originalBitmap.getWidth()/scaleFactor,
                    originalBitmap.getHeight()/scaleFactor, true);
            Matrix m = new Matrix();
            m.postRotate(90);
            Bitmap rotatedBitmap = Bitmap.createBitmap(scaledBitmap, 0, 0, scaledBitmap.getWidth(), scaledBitmap.getHeight(), m, true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR1) {
                Log.d("size:", String.valueOf(rotatedBitmap.getByteCount()));
            } else {// www. j  a  va  2s.c o m
                Log.d("size:", String.valueOf(rotatedBitmap.getRowBytes() * rotatedBitmap.getHeight()));
            }
            Log.d("width", String.valueOf(rotatedBitmap.getWidth()));
            Log.d("Height", String.valueOf(rotatedBitmap.getHeight()));
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            rotatedBitmap.compress(Bitmap.CompressFormat.PNG, 20, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            Log.d("size d:", String.valueOf(byteArray.length));
            String imgageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
            try {
                final String retFunction = "javascript:mostrarFoto('"+URLEncoder.encode(imgageBase64, "UTF-8")+"' , '"+strHtmlFoto+"' )";

                runOnUiThread(new Runnable() {
                    public void run() {
                        mWebView.evaluateJavascript(retFunction, null);
                    }
                });
            } catch(Exception ex) {
                ex.printStackTrace();
            }
        }

        switch (requestCode) {
            case PICKFILE_RESULT_CODE:
                if (resultCode == -1) {
                    Uri selectedImage = data.getData();
                    try {
                        // Do whatever you want with this bitmap (image)
                        Bitmap bitmapImage = MediaStore.Images.Media.getBitmap(this.getContentResolver(), selectedImage);
                        Log.i("Image Path", selectedImage.getPath());
                        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                        bitmapImage.compress(Bitmap.CompressFormat.PNG, 20, byteArrayOutputStream);
                        byte[] byteArray = byteArrayOutputStream.toByteArray();
                        Log.d("size d:", String.valueOf(byteArray.length));
                        String imgageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        try {
                            final String retFunction = "javascript:mostrarFoto('"+URLEncoder.encode(imgageBase64, "UTF-8")+"' , '"+strHtmlFoto+"' )";

                            runOnUiThread(new Runnable() {
                                public void run() {
                                    mWebView.evaluateJavascript(retFunction, null);
                                }
                            });
                        } catch(Exception ex) {
                            ex.printStackTrace();
                        }
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    /*
                    Uri uri = data.getData();
                    String fileName = getFileName(uri);

                    // The temp file could be whatever you want
                    try {
                        File fileCopy = copyToTempFile(uri, new File(fileName));
                        currentPhotoPath = fileCopy.getAbsolutePath();
                        Bitmap originalBitmap = BitmapFactory.decodeFile(currentPhotoPath);

                        int scaleFactor = 4;
                        Bitmap scaledBitmap = Bitmap.createScaledBitmap(originalBitmap, originalBitmap.getWidth()/scaleFactor,
                                originalBitmap.getHeight()/scaleFactor, true);
                        Matrix m = new Matrix();
                        m.postRotate(90);
                        Bitmap rotatedBitmap = Bitmap.createBitmap(scaledBitmap, 0, 0, scaledBitmap.getWidth(), scaledBitmap.getHeight(), m, true);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR1) {
                            Log.d("size:", String.valueOf(rotatedBitmap.getByteCount()));
                        } else {// www. j  a  va  2s.c o m
                            Log.d("size:", String.valueOf(rotatedBitmap.getRowBytes() * rotatedBitmap.getHeight()));
                        }
                        Log.d("width", String.valueOf(rotatedBitmap.getWidth()));
                        Log.d("Height", String.valueOf(rotatedBitmap.getHeight()));
                        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                        rotatedBitmap.compress(Bitmap.CompressFormat.PNG, 20, byteArrayOutputStream);
                        byte[] byteArray = byteArrayOutputStream.toByteArray();
                        Log.d("size d:", String.valueOf(byteArray.length));
                        String imgageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        try {
                            final String retFunction = "javascript:mostrarFoto('"+URLEncoder.encode(imgageBase64, "UTF-8")+"' , '"+strHtmlFoto+"' )";

                            runOnUiThread(new Runnable() {
                                public void run() {
                                    mWebView.evaluateJavascript(retFunction, null);
                                }
                            });
                        } catch(Exception ex) {
                            ex.printStackTrace();
                        }

                    } catch (IOException e) {
                        e.printStackTrace();
                    }*/


                }

                break;
        }
    }

    private String getFileName(Uri uri) throws IllegalArgumentException {
        // Obtain a cursor with information regarding this uri
        Cursor cursor = getContentResolver().query(uri, null, null, null, null);
        if (cursor.getCount() <= 0) {
            cursor.close();
            throw new IllegalArgumentException("Can't obtain file name, cursor is empty");
        }
        cursor.moveToFirst();
        String fileName = cursor.getString(cursor.getColumnIndexOrThrow(OpenableColumns.DISPLAY_NAME));
        cursor.close();
        return fileName;
    }


    private File copyToTempFile(Uri uri, File tempFile) throws IOException {
        // Obtain an input stream from the uri
        InputStream inputStream = getContentResolver().openInputStream(uri);
        if (inputStream == null) {
            throw new IOException("Unable to obtain input stream from URI");
        }
        // Copy the stream to the temp file
        FileUtils.copyInputStreamToFile(inputStream, tempFile);
        return tempFile;
    }

    private void dispatchTakePictureIntent() {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (intent.resolveActivity(getPackageManager()) != null) {
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (photoFile != null) {
                Log.d("oath", photoFile.getAbsolutePath());
                Uri photoURI = FileProvider.getUriForFile(getApplicationContext(),
                        "com.example.disnovacreditos.fileprovider", photoFile);
                intent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
                startActivityForResult(intent, REQUEST_TAKE_PHOTO);
            }
        }
    }

    private String encodeImage(Bitmap bm)
    {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG,100,baos);
        byte[] b = baos.toByteArray();
        String encImage = Base64.encodeToString(b, Base64.DEFAULT);

        return encImage;
    }

    private static class LocalContentWebViewClient extends WebViewClientCompat {

        private final WebViewAssetLoader mAssetLoader;

        LocalContentWebViewClient(WebViewAssetLoader assetLoader) {
            mAssetLoader = assetLoader;
        }

        @Override
        @RequiresApi(21)
        public WebResourceResponse shouldInterceptRequest(WebView view,
                                                          WebResourceRequest request) {
            return mAssetLoader.shouldInterceptRequest(request.getUrl());
        }

        @Override
        @SuppressWarnings("deprecation") // to support API < 21
        public WebResourceResponse shouldInterceptRequest(WebView view,
                                                          String url) {
            return mAssetLoader.shouldInterceptRequest(Uri.parse(url));
        }
    }


    public class WebAppInterface {
        Context mContext;

        /** Instantiate the interface and set the context */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void tomarFoto(String idHtmlFoto, int coficienteCalidad_) {
            //coficienteCalidad = 1 es mas alta calidad,  >1 va menorando la calidad
            coficienteCalidad=coficienteCalidad_;
            strHtmlFoto = idHtmlFoto;
            dispatchTakePictureIntent();
        }

        @JavascriptInterface
        public void selecionarFoto(String idHtmlFoto) {
            strHtmlFoto = idHtmlFoto;
            Intent chooseFile = new Intent(Intent.ACTION_GET_CONTENT);
            chooseFile.setType("image/*");
            chooseFile = Intent.createChooser(chooseFile, "Selecione un solo archivo");
            startActivityForResult(chooseFile, PICKFILE_RESULT_CODE);
        }

        @JavascriptInterface
        public void abrirDialogoFirma(String idHtmlFoto) {

            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            ViewGroup viewGroup = findViewById(android.R.id.content);
            View dialogView = LayoutInflater.from( getApplicationContext() ).inflate(R.layout.firma_dialog, viewGroup, false);
            builder.setView(dialogView);
            builder.setPositiveButton("Cerrar", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    //getting the bitmap from DrawView class
                    Bitmap bmp=paint.save();
                    //opening a OutputStream to write into the file
                    OutputStream imageOutStream = null;
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    bmp.compress(Bitmap.CompressFormat.PNG, 20, byteArrayOutputStream);
                    byte[] byteArray = byteArrayOutputStream.toByteArray();
                    Log.d("size d:", String.valueOf(byteArray.length));
                    String imgageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
                    try {
                        final String retFunction = "javascript:mostrarFoto('"+URLEncoder.encode(imgageBase64, "UTF-8")+"' , '"+idHtmlFoto+"' )";

                        runOnUiThread(new Runnable() {
                            public void run() {
                                mWebView.evaluateJavascript(retFunction, null);
                            }
                        });
                    } catch(Exception ex) {
                        ex.printStackTrace();
                    }
                }
            })
            .setNegativeButton("Guardar", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    //getting the bitmap from DrawView class
                    Bitmap bmp=paint.save();
                    //opening a OutputStream to write into the file
                    OutputStream imageOutStream = null;
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    bmp.compress(Bitmap.CompressFormat.PNG, 20, byteArrayOutputStream);
                    byte[] byteArray = byteArrayOutputStream.toByteArray();
                    Log.d("size d:", String.valueOf(byteArray.length));
                    String imgageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
                    try {
                        final String retFunction = "javascript:mostrarFoto('"+URLEncoder.encode(imgageBase64, "UTF-8")+"' , '"+idHtmlFoto+"' )";

                        runOnUiThread(new Runnable() {
                            public void run() {
                                mWebView.evaluateJavascript(retFunction, null);
                            }
                        });
                    } catch(Exception ex) {
                        ex.printStackTrace();
                    }
                }
            });

            AlertDialog alertDialog = builder.create();
            alertDialog.show();
            alertDialog.getWindow().setLayout(640, 480);

            paint = (DrawView) alertDialog.findViewById(R.id.draw_view);
            //pass the height and width of the custom view to the init method of the DrawView object
            ViewTreeObserver vto = paint.getViewTreeObserver();
            vto.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {

                    paint.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                    int width = paint.getMeasuredWidth();
                    int height = paint.getMeasuredHeight();
                    paint.init(height, width);
                }
            });



        }


        @JavascriptInterface
        public void obtenerUbicacion() {
            getLastLocation();
        }


        @JavascriptInterface
        /**
         * Ejemplo de parametro  "[b]SANGA CARANQUI VICTOR HUGO|cta: 06XXXXXX01|Fecha: 05-02-2021|Ced/Ruc : 0604863803001|Cajero: QCF154|Sucursal: Av de la presa un ynidad nacional|[hr]|[align=right]Retiro:100.00|[align=right]Comision:0.035|[align=right]Iva:0.00|[align=right]Total:20.35";
         */
        public void imprimirTicket(String contenido) {

        }


    }


    @SuppressLint("MissingPermission")
    private void getLastLocation() {
        // check if permissions are given
        if (checkPermissions()) {

            // check if location is enabled
            if (isLocationEnabled()) {

                // getting last
                // location from
                // FusedLocationClient
                // object
                mFusedLocationClient.getLastLocation().addOnCompleteListener(new OnCompleteListener<Location>() {
                    @Override
                    public void onComplete(@NonNull Task<Location> task) {
                        Location location = task.getResult();
                        if (location == null) {
                            requestNewLocationData();
                        } else {
                            latitud = location.getLatitude();
                            longitud = location.getLongitude();
                            mostrarUbicacion();
                        }
                    }
                });
            } else {
                Toast.makeText(this, "Please turn on" + " your location...", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                startActivity(intent);
            }
        } else {
            // if permissions aren't available,
            // request for permissions
            requestPermissions();
        }
    }

    public void mostrarUbicacion(){
        mWebView.loadUrl("javascript:mostrarUbicacion("+latitud+", "+longitud+" )");
    }



    @SuppressLint("MissingPermission")
    private void requestNewLocationData() {

        // Initializing LocationRequest
        // object with appropriate methods
        LocationRequest mLocationRequest = new LocationRequest();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(5);
        mLocationRequest.setFastestInterval(0);
        mLocationRequest.setNumUpdates(1);

        // setting LocationRequest
        // on FusedLocationClient
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        mFusedLocationClient.requestLocationUpdates(mLocationRequest, mLocationCallback, Looper.myLooper());
    }

    private LocationCallback mLocationCallback = new LocationCallback() {

        @Override
        public void onLocationResult(LocationResult locationResult) {
            Location mLastLocation = locationResult.getLastLocation();
            latitud= mLastLocation.getLatitude();
            longitud= mLastLocation.getLongitude();
            mostrarUbicacion();
        }
    };

    // method to check for permissions
    private boolean checkPermissions() {
        return ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        // If we want background location
        // on Android 10.0 and higher,
        // use:
        // ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    // method to request for permissions
    private void requestPermissions() {
        ActivityCompat.requestPermissions(this, new String[]{
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION}, PERMISSION_ID);
    }

    // method to check
    // if location is enabled
    private boolean isLocationEnabled() {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    }




}
