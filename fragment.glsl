varying vec2 vCoordinates;
varying vec3 vPos;
uniform sampler2D t1;
uniform sampler2D mask;
//uniform sampler2D t2;

void main(){
    vec4 maskTexture = texture2D(mask,gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x/512.,vCoordinates.y/512.);
    vec4 image = texture2D(t1,myUV);

    float alpha = 1. - clamp(0.,1.,abs(vPos.z/900.));


    gl_FragColor = image;
    //gl_FragColor = maskTexture;

    gl_FragColor.a *=maskTexture.r*alpha;
}