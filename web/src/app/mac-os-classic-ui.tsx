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
