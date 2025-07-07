import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

public class YouTubePlayerApp extends Application {
    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();

        // Replace VIDEO_ID with your desired YouTube video ID
        String videoId = "dQw4w9WgXcQ";
        String content = "<iframe width='100%' height='100%' "
                + "src='https://www.youtube.com/embed/" + videoId + "?autoplay=0&controls=1' "
                + "frameborder='0' allowfullscreen></iframe>";

        webEngine.loadContent(content, "text/html");

        Scene scene = new Scene(webView, 800, 450);
        stage.setTitle("Custom YouTube Player (JavaFX)");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
