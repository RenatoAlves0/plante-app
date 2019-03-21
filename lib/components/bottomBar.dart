import 'package:flutter/material.dart';

class BottomBar extends StatefulWidget {
  final int itemSelected;
  const BottomBar({Key key, this.itemSelected}) : super(key: key);

  @override
  _BottomBarState createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  List<Color> cores = [
    Colors.green[700],
    Colors.blue[700],
    Colors.brown[700],
    Colors.amber[700],
    Colors.purple[700],
  ];
  List<IconData> icones = [
    Icons.spa,
    Icons.cloud,
    Icons.grain,
    Icons.wb_sunny,
    Icons.colorize,
  ];
  List<String> _titulos = ['Planta', 'Clima', 'Solo', 'Luz', 'Nutriente'];
  int itemSelected;
  bool receivedProps = true;

  void changeItemSelected(int index) {
    setState(() {
      itemSelected = index;
    });
  }

  @override
  void initState() {
    super.initState();
    if (receivedProps) {
      setState(() {
        changeItemSelected(widget.itemSelected);
        receivedProps = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return builBottomBar();
  }

  Widget builBottomBar() {
    return BottomNavigationBar(
      onTap: (index) => changeItemSelected(index),
      currentIndex: itemSelected,
      items: [
        BottomNavigationBarItem(
          icon: Icon(icones[0], color: cores[0]),
          title: Text(_titulos[0],
              style: TextStyle(color: cores[0], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(icones[1], color: cores[1]),
          title: Text(_titulos[1],
              style: TextStyle(color: cores[1], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(icones[2], color: cores[2]),
          title: Text(_titulos[2],
              style: TextStyle(color: cores[2], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(icones[3], color: cores[3]),
          title: Text(_titulos[3],
              style: TextStyle(color: cores[3], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(icones[4], color: cores[4]),
          title: Text(_titulos[4],
              style: TextStyle(color: cores[4], fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
