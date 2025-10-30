uniform float uTime;
uniform vec2 uResolution;
uniform float uIntro;
varying vec2 vUv;

    void mainImage(out vec4 O, vec2 I)
    {
        float t = uTime * 0.5,
        i,
        z,
        d;

        for(O *= i; i++ < 5e1; O += .001 / d)
        {
            vec3 res = vec3(uResolution.x, uResolution.y, uResolution.y);
            vec3 p = z * normalize(vec3(I + I, 0.) - res);
            p.z += 6.;
            for(d = 1.; d < 9.; d /= .8)
                p += cos(p.yzx * d - vec3(t + t, t, 0.)) / d;
            z += d = .01 + .1 * length(p.xz);
        }

        O = tanh(O) * uIntro;
    }
    void main() {
      vec4 color;
      vec2 fragCoord = vUv * uResolution.xy;
      mainImage(color, fragCoord);
      gl_FragColor = color;
    }
