import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(title: "Plante", home: Home()));
}

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _plantas = 0;
  String _tipoPlanta = "Cacto";

  void _changePlantas(int a) {
    setState(() {
      _plantas += a;
      if(_plantas < 0) _tipoPlanta = "Carnívoras";
      else _tipoPlanta = "Cacto";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Image.asset( "images/cactos.jpg", fit: BoxFit.fitHeight, height: 800),

        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text( "Plantas: $_plantas", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.all(10.0),
                  child: FlatButton(
                    child: Text( "+", style: TextStyle(fontSize: 40, color: Colors.white),),
                    onPressed: () => _changePlantas(1)
                  ),
                ),

                Padding(
                  padding: EdgeInsets.all(10.0),
                  child: FlatButton(
                    child: Text( "-", style: TextStyle(fontSize: 40, color: Colors.white),),
                    onPressed: () =>_changePlantas(-1)
                  ),
                ),
              ],
            ),
            
            Text( "$_tipoPlanta", style: TextStyle(color: Colors.white, fontStyle: FontStyle.italic),),
          ],
        )
      ],
    );
  }
}
