import 'jquery-ui/ui/widgets/resizable';
import './style.css';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const MacOSClassicUI = () => {
  const screenRef = useRef<HTMLDivElement>(null);
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (screenRef.current) {
      // Make windows draggable
      $(".window").draggable({
        handle: "h2", 
        containment: ".screen", 
        scroll: false,
        stack: ".screen .window"
      });

      // Make disks resizable
      $("#systemDisk").resizable({
        containment: ".screen",
        minWidth: 450,
        minHeight: 140
      });
      
      $("#gamesDisk").resizable({
        containment: ".screen",
        minWidth: 350,
        minHeight: 140
      });
      
      $("#trashDisk").resizable({
        containment: ".screen",
        minWidth: 150,
        minHeight: 140
      });

      // Dragging icons
      $(".screen .item").draggable({
        containment: ".screen", 
        scroll: false
      });
      
      $(".content .item").draggable();

      // Enable click and double-click for system disk to open modal
      $("#system").draggable({
        containment: ".screen",
        scroll: false,
        start: function() {
          $(this).off('click dblclick');
        },
        stop: function() {
          $(this).on('click dblclick', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (openConnectModal) {
              openConnectModal();
            }
          });
        }
      });

      // Click event for system disk modal
      $("#system").on('click dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (openConnectModal) {
          openConnectModal();
        }
      });

      // Manage window z-index on click
      $(".window").on('click', function () {
        const up = parseInt($(this).css("zIndex"), 10);
        $(this).css("z-index", up + 8);
      });

      // Toggle window highlight
      $(".window").on('click', function () {
        $(this).addClass("zind");
        $(".window").not(this).removeClass("zind");
      });

      // About Finder animations
      $("#openAbout").on('click', function() {
        $("#finder").show();
        $("#finder").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
      });

      // Close Finder dialog
      $("#finder").on('click', function () {
        $(this).fadeOut(300);
      });

      // Close window on mouseup
      $(".close").on('mouseup', function () {
        $(this).parent("header").parent(".window").fadeOut(300);
      });
    }
  }, [openConnectModal]);

  return (
    <div className="screen" ref={screenRef}>
      <div className="toolbar">
        <div>File</div>
        <div>Edit</div>
        <div>View</div>
        <div>Special</div>
      </div>

      <div id="system" className="item">
        <div className="icon">
          <div className="hardDisk"></div>
        </div>
        System Disk
      </div>

      <div id="games" className="item">
        <div className="icon">
          <div className="disk big">
            <div className="label"></div>
            <div className="shutter"></div>
          </div>
        </div>
        Games
      </div>

      <div id="emptyFolder" className="item">
        <div className="icon">
          <div className="folder"></div>
        </div>
        Empty Folder
      </div>

      <div id="trash" className="item">
        <div className="icon">
          <div className="trash">
            <div className="cover"></div>
            <div className="can"></div>
          </div>
        </div>
        Trash
      </div>

      <div id="systemDisk" className="section window">
        <div className="content">
          <div className="item">
            <div className="icon">
              <div className="folder"></div>
            </div>
            System Folder
          </div>
          <div className="item">
            <div className="icon">
              <div className="diskCopy">
                <div className="disk">
                  <div className="label"></div>
                  <div className="shutter"></div>
                </div>
              </div>
            </div>
            Disk Copy
          </div>
          <div className="item">
            <div className="icon">
              <div className="font"></div>
            </div>
            Font
          </div>
          <div className="item">
            <div className="icon">
              <div className="folder"></div>
            </div>
            Empty Folder
          </div>
        </div>
      </div>

      <div id="gamesDisk" className="section window">
        <h2 className="title">Games</h2>
      </div>

      <div id="trashDisk" className="section window">
        <h2 className="title">Trash</h2>
        <div className="content">
          <div>Empty folder</div>
        </div>
      </div>

      <div id="finder" className="section dialog">
        <h2>The Macintosh Finder, Version 1.0 (18 Jan 84)</h2>
        <h4>© 1984 Apple Computer</h4>
      </div>
    </div>
  );
};

export default MacOSClassicUI;

