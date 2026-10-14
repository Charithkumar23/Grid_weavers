package com.gridweaver.controller;

import com.gridweaver.model.MicrogridState;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MicrogridRestController {

    @GetMapping("/api/microgrid/state")
    public MicrogridState getMicrogridState() {

        return new MicrogridState(
                230.0,
                50.0,
                1200.0,
                85.0,
                true
        );
    }
}
