export const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const fluidShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform sampler2D iPreviousFrame;
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;
varying vec2 vUv;

vec2 ur;
vec2 U;

float ln(vec2 p, vec2 a, vec2 b) {
    return length(p - a - (b - a) * clamp(dot(p - a, b - a) / dot(b - a, b - a), 0.0, 1.0));
}

vec4 t(vec2 v, int a, int b) {
    return texture2D(iPreviousFrame, fract((v + vec2(float(a), float(b))) / ur));
}

vec4 t(vec2 v) {
    return texture2D(iPreviousFrame, fract(v / ur));
}

float area(vec2 a, vec2 b, vec2 c) {
    float A = length(b - c);
    float B = length(c - a);
    float C = length(a - b);
    float s = 0.5 * (A + B + C);
    return sqrt(s * (s - A) * (s - B) * (s - C)); 
}

void main() {
    ur = iResolution.xy;
    U = vUv * ur;

    if (iFrame < 1) {
        float w = 0.5 + sin(0.2 * U.x) * 0.5;
        float q = length(U - 0.5 * ur);
        gl_FragColor = vec4(0.1 * exp(-0.001 * q * q), 0.0, 0.0, w);
    } else {
        vec2 v = U;
        vec2 A = v + vec2(1.0, 1.0);
        vec2 B = v + vec2(1.0, -1.0);
        vec2 C = v + vec2(-1.0, 1.0);
        vec2 D = v + vec2(-1.0, -1.0);

        for (int i = 0; i < 2; i++) {
            v -= t(v).xy;
            A -= t(A).xy;
            B -= t(B).xy;
            C -= t(C).xy;
            D -= t(D).xy;
        }

        vec4 mc = t(v);
        vec4 n = t(v, 0, 1);
        vec4 e = t(v, 1, 0);
        vec4 s = t(v, 0, -1);
        vec4 w = t(v, -1, 0);

        vec4 ne = 0.25 * (n + e + s + w);
        vec4 me = mix(mc, ne, vec4(0.15, 0.15, 0.95, 0.0));
        me.z = me.z - 0.01 * ((area(A, B, C) + area(B, C, D)) - 4.0);

        vec4 pr = vec4(e.x, w.x, n.y, s.y); // x-diff, y-diff
        me.xy += 100.0 * vec2(pr.x - pr.y, pr.z - pr.w) / ur;

        me.xy *= uFluidDecay;
        me.z *= uTrailLength;

        if (iMouse.z > 0.0) {
            vec2 mousePos = iMouse.xy;
            vec2 mousePrev = iMouse.zw;
            vec2 mouseVel = mousePos - mousePrev;
            float velMagnitude = length(mouseVel);
            float q = ln(U, mousePos, mousePrev);
            vec2 m = mouseVel;
            float l = length(m);
            if (l > 0.0) m = min(1.0, 10.0) * m / l;

            float brushSizeFactor = 1e-4 / uBrushSize;
            float strengthFactor = 0.03 * uBrushStrength;

            float falloff = exp(-brushSizeFactor * q * q * q);
            falloff = pow(falloff, 0.5);

            me.xyw += strengthFactor * falloff * vec3(m, 10.0);

            if (velMagnitude < 2.0) {
                float distToCursor = length(U - mousePos);
                float influence = exp(-distToCursor * 0.01);
                float cursorDecay = mix(1.0, uStopDecay, influence);
                me.xy *= cursorDecay;
                me.z *= cursorDecay;
            }
        }

        gl_FragColor = clamp(me, -0.4, 0.4);
    }
}
       
`;

export const displayShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform sampler2D iFluid;
    uniform float uDistortionAmount;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uColorIntensity;
    uniform float uSoftness;
    varying vec2 vUv;

    void main() {
        vec2 fragCoord = vUv * iResolution;

        vec4 fluid = texture2D(iFluid, vUv);
        vec2 fluidVel = fluid.xy;

        float mr = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord * 2.0 - iResolution) / mr;

        uv += fluidVel * (0.5 * uDistortionAmount );

        float d = -iTime * 0.5;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; i++) {
            a += cos(i - d - a * uv.x);
            d += sin(uv.y * i + a);
        }
        d += iTime * 0.5;

        float mixer1 = cos(uv.x * d) * 0.5 + 0.5;
        float mixer2 = sin(uv.y * d) * 0.5 + 0.5;
        float mixer3 = sin(d + a) * 0.5 + 0.5;

        float smoothAmount = clamp(uSoftness * 0.1, 0.0, 0.9);
        mixer1 = mix(mixer1, 0.5, smoothAmount);
        mixer2 = mix(mixer2, 0.5, smoothAmount);
        mixer3 = mix(mixer3, 0.5, smoothAmount);

        vec3 col = mix(uColor1, uColor2, mixer1);
        col = mix(col, uColor3, mixer2);
        col = mix(col, uColor4, mixer3);

        col *= uColorIntensity;

        gl_FragColor = vec4(col, 1.0);


    }
`;
