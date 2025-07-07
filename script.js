import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import java.io.File;

public class YouTubePlayerFX extends Application {
    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        // Load your local HTML file (update path as needed)
        String path = new File("index.html").toURI().toString();
        webView.getEngine().load(path);

        Scene scene = new Scene(webView, 440, 800);
        stage.setTitle("Custom YouTube Player");
        stage.setScene(scene);
        stage.show();
    }
    public static void main(String[] args) {
        launch(args);
    }
}
