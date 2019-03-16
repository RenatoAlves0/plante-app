import 'package:flutter/material.dart';

class BottomBar extends StatefulWidget {
  final int propsItemSelected;
  const BottomBar({Key key, this.propsItemSelected}) : super(key: key);

  @override
  _BottomBarState createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  List<Color> _cores = [
    Colors.green,
    Color.fromARGB(255, 25, 112, 182),
    Colors.brown,
    Colors.amber
  ];
  List<String> _titulos = ["Planta", "Clima", "Solo", "Luz"];
  int itemSelected;
  bool receivedProps = true;

  void changeItemSelected(int index) {
    setState(() {
      itemSelected = index;
    });
  }

  void init(int propsItemSelected) {
    if (receivedProps) {
      setState(() {
        changeItemSelected(propsItemSelected);
        receivedProps = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    init(widget.propsItemSelected);
    return builBottomBar();
  }

  Widget builBottomBar() {
    return BottomNavigationBar(
      onTap: (index) => changeItemSelected(index),
      currentIndex: itemSelected,
      items: [
        BottomNavigationBarItem(
          icon: Icon(Icons.spa),
          title: Text(_titulos[0]),
          backgroundColor: _cores[0],
        ),
        BottomNavigationBarItem(
            icon: Icon(Icons.cloud_queue),
            title: Text(_titulos[1]),
            backgroundColor: _cores[1]),
        BottomNavigationBarItem(
            icon: Icon(Icons.grain),
            title: Text(_titulos[2]),
            backgroundColor: _cores[2]),
        BottomNavigationBarItem(
            icon: Icon(Icons.wb_sunny),
            title: Text(_titulos[3]),
            backgroundColor: _cores[3]),
      ],
    );
  }
}
